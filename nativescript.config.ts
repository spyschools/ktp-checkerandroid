import type { NativeScriptConfig } from '@nativescript/core';

const config: NativeScriptConfig = {
  id: 'com.spyschools.ktpchecker',
  appPath: 'app',
  // The repository keeps Android resources inside app/App_Resources/.
  // Paths in NativeScript config are relative to the repository root.
  appResourcesPath: 'app/App_Resources',
  android: {
    v8Flags: '--expose_gc',
  },
};

export default config;
