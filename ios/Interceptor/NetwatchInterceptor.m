//
//  NetwatchInterceptor.m
//  RNNetwatch
//
//  Created by Imran Mentese on 17/02/2021.
//  Copyright © 2021 Imran Mentese. All rights reserved.
//

#import "NetwatchInterceptor.h"

@interface NetwatchInterceptor ()<NSURLConnectionDelegate, NSURLConnectionDataDelegate>
@property (nonatomic, strong) NSURLResponse *response;
@property (nonatomic, strong) NSMutableData *data;
@property (nonatomic,strong) NSUserDefaults *preferences;
@property (nonatomic,strong) NativeRequest *currentRequest;
@end

@implementation NetwatchInterceptor
@synthesize currentRequest;
@synthesize preferences;
@synthesize connection = connection_;


#pragma mark - superclass methods
- (instancetype)init {
    self = [super init];
    if (self) {
        preferences = [NSUserDefaults standardUserDefaults];
    }
    return self;
}

/**
 * Implementation of URLProtocol abstract method. Should determine if,
 * according to the request scheme, the Interceptor is able to handle the request.
 * @param request the original NSURLRequest
 * @return BOOL true if Interceptor handles the scheme, ortherwise, returns false
 */
+ (BOOL)canInitWithRequest:(NSURLRequest *) request {
    if ([NSURLProtocol propertyForKey:@"NetwatchHandledKey" inRequest:request]) {
        return NO;
    }
    
    return YES;
}

/**
 * Implementation of NSURLProtocol abstract method.
 * - seealso:
 [NSURLProtocol](https://developer.apple.com/documentation/foundation/nsurlprotocol)
 */
+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *) request {
    return request;
}

/**
 * Implementation of NSURLProtocol method.
 * - seealso:
 [NSURLProtocol](https://developer.apple.com/documentation/foundation/nsurlprotocol/1408989-startloading?language=objc)
 * Starts loading of a request
 */
- (void)startLoading {
    self.data = [NSMutableData data];
    
    NSMutableURLRequest *newRequest = [self.request mutableCopy];
    [NSURLProtocol setProperty:@YES forKey:@"NetwatchHandledKey" inRequest:newRequest];
    
    [self setConnection:[NSURLConnection connectionWithRequest:newRequest delegate:self]];
    
    currentRequest=[[NativeRequest alloc] init];
    currentRequest.requestHeaders=newRequest.allHTTPHeaderFields;
    currentRequest.url=newRequest.URL.absoluteString;
    currentRequest.method=newRequest.HTTPMethod;
    currentRequest.startTime=([[NSDate date] timeIntervalSince1970] * 1000.0);
    currentRequest.readyState=4;

    NSTimeInterval myID=[[NSDate date] timeIntervalSince1970];
    double randomNum=((double)(arc4random() % 100))/10000;
    currentRequest._id=myID+randomNum;
}

/**
 * Implementation of NSURLProtocol method.
 * - seealso:
 [NSURLProtocol](https://developer.apple.com/documentation/foundation/nsurlprotocol/1408666-stoploading?language=objc)
 * Stop loading of a request calling the connection cancel method.
 */
- (void)stopLoading {
    [[self connection] cancel];
    currentRequest.endTime=([[NSDate date] timeIntervalSince1970] * 1000.0);
    
    // Save data in NSUserDefaults
    if (currentRequest != nil) {
        NSArray *cachedRequests = [self readArrayWithCustomObjFromUserDefaults];
        NSMutableArray *mutableArray = [[NSMutableArray alloc] init];
        [mutableArray addObject:[currentRequest toJSON]];
        [mutableArray addObjectsFromArray:cachedRequests];
        
        if ([mutableArray count] >= kSaveRequestMaxCount) {
            [mutableArray removeLastObject];
        }
        
        [NetwatchInterceptor writeArrayWithCustomObjToUserDefaults: mutableArray];
    }
}

/**
 * Implementation of NSURLConnectionDataDelegate method that receives and handles
 * - seealso:
 [NSURLConnectionDataDelegate](https://developer.apple.com/documentation/foundation/nsurlconnectiondatadelegate/1415830-connection?language=objc)
 * Invokes the client method with the error. Empties the connection,data and repsonse variables.
 */
- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    [[self client] URLProtocol:self didFailWithError:error];
}

/**
 * Implementation of NSURLConnectionDataDelegate method that receives and handles
 * the info when a request will be sent.
 * - seealso:
 [NSURLConnectionDataDelegate](https://developer.apple.com/documentation/foundation/nsurlconnectiondatadelegate/1415830-connection?language=objc)
 * Notified when a request will be sent
 */
- (NSURLRequest *)connection:(NSURLConnection *)connection willSendRequest:(NSURLRequest *)request redirectResponse:(NSURLResponse *)response {
    if (response != nil){
        self.response = response;
        [[self client] URLProtocol:self wasRedirectedToRequest:request redirectResponse:response];
    }

    return request;
}

/**
 * Implementation of NSURLConnectionDataDelegate method.
 * - seealso:
 [NSURLConnectionDataDelegate](https://developer.apple.com/documentation/foundation/nsurlconnectiondatadelegate/1416409-connectiondidfinishloading?language=objc)
 * Notified when a response is received, redirects the response to the client.
 */
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    [[self client] URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
    
    currentRequest.status=(int)[((NSHTTPURLResponse *) response) statusCode];
    currentRequest.responseHeaders=[((NSHTTPURLResponse *) response) allHeaderFields];
    currentRequest.responseContentType=[((NSHTTPURLResponse *) response) MIMEType];
    self.response = response;
}

/**
 * Implementation of NSURLConnectionDataDelegate method.
 * - seealso:
 [NSURLConnectionDataDelegate](https://developer.apple.com/documentation/foundation/nsurlconnectiondatadelegate/1416409-connectiondidfinishloading?language=objc)
 * Notified when data is received, notifies the client with respective data.
 */
- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    [[self client] URLProtocol:self didLoadData:data];
    [self.data appendData:data];
    currentRequest.response=[NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
}

/**
 * Implementation of NSURLConnectionDataDelegate method.
 * - seealso:
 [NSURLConnectionDataDelegate](https://developer.apple.com/documentation/foundation/nsurlconnectiondatadelegate/1416409-connectiondidfinishloading?language=objc)
 * Called when a connection finish loading passes the info to the client
 * and clears the connection,data and repsonse variables.
 */
- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    [[self client] URLProtocolDidFinishLoading:self];
}

#pragma mark - Utils

+ (void)writeArrayWithCustomObjToUserDefaults:(NSMutableArray *)myArray
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:[NSKeyedArchiver archivedDataWithRootObject:myArray] forKey:kNetwatchUserDefault];
    [defaults synchronize];
}

-(NSArray *)readArrayWithCustomObjFromUserDefaults
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSData *data = [defaults objectForKey:kNetwatchUserDefault];
    NSArray *myArray = [NSKeyedUnarchiver unarchiveObjectWithData:data];
    [defaults synchronize];
    return myArray;
}

@end

#if WORKAROUND_MUTABLE_COPY_LEAK
@implementation NSURLRequest(AvoidMutableCopyLeak)

- (id) avoidMutableCopyLeak {
    
    NSMutableURLRequest *mutableURLRequest = [self mutableCopy];

    return mutableURLRequest;
}

@end
#endif
