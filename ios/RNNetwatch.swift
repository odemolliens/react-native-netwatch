//
//  RNNetwatch.swift
//  RNNetwatch
//
//  Copyright © 2020 Imran Mentese. All rights reserved.
//

import Foundation

@objc(RNNetwatch)
class RNNetwatch: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
