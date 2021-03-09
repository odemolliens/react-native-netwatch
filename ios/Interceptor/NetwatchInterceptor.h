//
//  Interceptor.h
//  RNNetwatch
//
//  Created by Imran Mentese on 17/02/2021.
//  Copyright © 2021 Imran Mentese. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "NativeRequest.h"

NS_ASSUME_NONNULL_BEGIN

#define kSaveRequestMaxCount 20
static NSString * const kNetwatchUserDefault = @"NetwatchUserDefault";

@interface NetwatchInterceptor : NSURLProtocol

@property (nonatomic, readwrite, strong) NSURLConnection *connection;

@end

NS_ASSUME_NONNULL_END
