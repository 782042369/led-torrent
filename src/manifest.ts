const manifest = {
  manifest_version: 3,
  homepage_url: 'https://demo.xxx.com',
  name: '一键领种',
  description: 'pt一键领种',
  version: '0.1',
  icons: {
    '16': 'icon/icon-16.png',
    '32': 'icon/icon-32.png',
    '48': 'icon/icon-48.png',
    '64': 'icon/icon-64.png',
    '128': 'icon/icon-128.png'
  },
  action: {
    default_title: 'chrome demo',
    default_popup: './index.html',
    default_icon: {
      '16': 'icon/icon-16.png',
      '32': 'icon/icon-32.png',
      '48': 'icon/icon-48.png',
      '64': 'icon/icon-64.png',
      '128': 'icon/icon-128.png'
    }
  },
  content_security_policy: {
    extension_pages:
      "script-src 'self'; object-src 'self'; frame-ancestors 'none';"
  },
  externally_connectable: {
    ids: ['*']
  },
  permissions: ['storage', 'activeTab', 'scripting', 'tabs'],
  background: {
    service_worker: './background.ts',
    type: 'module'
  },
  commands: {
    _execute_action: {
      suggested_key: {
        windows: 'Alt+Shift+N',
        mac: 'Alt+Shift+N',
        chromeos: 'Alt+Shift+N',
        linux: 'Alt+Shift+N'
      }
    }
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['./inject.ts'],
      run_at: 'document_start'
    }
  ]
  //   web_accessible_resources: ['./inject.js']
};

export default manifest;
