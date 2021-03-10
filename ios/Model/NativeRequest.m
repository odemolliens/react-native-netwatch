//
//  NativeRequest.m
//  RNNetwatch
//
//  Created by Imran Mentese on 09/03/2021.
//  Copyright © 2021 Imran Mentese. All rights reserved.
//

#import "NativeRequest.h"

@implementation NativeRequest

- (NSString *)formateRequestHeaderFieldKey:(NSString *)key object:(id)obj
{
    return [NSString stringWithFormat:@"%@:%@\n",key?:@"",obj?:@""];
}

- (NSDictionary*) toJSON {
    return @{
        @"_id": self._id ? [NSString stringWithFormat:@"%i", self._id] : @"",
        @"url": self.url ?: @"",
        @"method": self.method ?: @"",
        @"status": self.status ? [NSString stringWithFormat:@"%i", self.status] : @"",
        @"readyState": self.readyState ? [NSString stringWithFormat:@"%i", self.readyState] : @"",
        @"startTime": self.startTime ? [NSString stringWithFormat:@"%li", self.startTime] : @"",
        @"endTime": self.endTime? [NSString stringWithFormat:@"%li", self.endTime] : @"",
        @"requestHeaders": self.requestHeaders ?: @"",
        @"responseHeaders": self.responseHeaders ?: @"",
        @"responseContentType": self.responseContentType ?: @"",
        @"response": self.response ?: @""
    };
}

@end
