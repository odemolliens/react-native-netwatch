//
//  NativeRequest.h
//  RNNetwatch
//
//  Created by Imran Mentese on 09/03/2021.
//  Copyright © 2021 Imran Mentese. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@interface NativeRequest : NSObject

@property (assign, nonatomic) int _id;
@property (strong, nonatomic) NSString *url;
@property (strong, nonatomic) NSString *method;
@property (assign, nonatomic) int status;
@property (assign, nonatomic) int readyState;
@property (assign, nonatomic) long startTime;
@property (assign, nonatomic) long endTime;
@property (strong, nonatomic) NSObject *requestHeaders;
@property (strong, nonatomic) NSObject *responseHeaders;
@property (strong, nonatomic) NSString *responseContentType;
@property (strong, nonatomic) NSObject *response;

- (NSDictionary*) toJSON;

@end
NS_ASSUME_NONNULL_END
