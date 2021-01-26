//
//  ExampleModule.m
//  example
//
//  Created by Imran Mentese on 26/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "ExampleModule.h"

@implementation ExampleModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(fetchSomething:(NSString*)url) {
  NSString *targetUrl = [NSString stringWithFormat:@"%@", url];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
  [request setHTTPMethod:@"GET"];
  [request setURL:[NSURL URLWithString:targetUrl]];

  NSError *error = nil;
  NSHTTPURLResponse *responseCode = nil;

  NSData *oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&responseCode error:&error];

  if([responseCode statusCode] != 200){
    NSLog(@"<<>> Error: %ld", (long)[responseCode statusCode]);
  } else {
    NSLog(@"<<>> Success response: %ld",(long)[responseCode statusCode]);
  }
}


@end
