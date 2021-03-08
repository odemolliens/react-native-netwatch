//
//  RNNetwatch.m
//  RNNetwatch
//
//  Copyright © 2020 Imran Mentese. All rights reserved.
//

#import "RNNetwatch.h"
#import "NetwatchInterceptor.h"

@implementation RNNetwatch

RCT_EXPORT_MODULE(RNNetwatch);


RCT_EXPORT_METHOD(startNetwatch) {
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    if (configuration.protocolClasses != nil ) {
        configuration.protocolClasses = @[[NetwatchInterceptor class]];
    }
}


RCT_EXPORT_METHOD(getNativeRequests : (RCTResponseSenderBlock)callback) {
    
}

@end
