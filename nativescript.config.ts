import type { NativeScriptConfig } from '@nativescript/core';

const config: NativeScriptConfig = {
  id: 'com.spyschools.ktpchecker',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
  },
};

export default config;
