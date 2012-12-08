//
//  AppDelegate.h
//  Tools for Paper
//
//  Created by Atsushi OHNO on 2012/11/28.
//  Copyright (c) 2012年 freiheit. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface AppDelegate : NSObject <NSApplicationDelegate> {
    NSStatusItem *statusItem;
    NSPasteboard *board;
    NSTimer *timer;
    NSString *prevStr;
}

@property (assign) IBOutlet NSWindow *window;
@property (assign) IBOutlet NSMenu *statusMenu;

@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext;

- (IBAction)saveAction:(id)sender;
- (IBAction)toggleState:(id)sender;
- (IBAction)quit:(id)sender;

@end
