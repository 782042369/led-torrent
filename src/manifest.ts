/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 15:02:24
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 23:32:38
 * @Description:
 */
const manifest = {
  manifest_version: 3,
  homepage_url: 'https://demo.xxx.com',
  name: '一键领种',
  description: 'pt一键领种',
  version: '0.3',
  icons: {
    '16': 'icon/logo.png',
    '32': 'icon/logo.png',
    '48': 'icon/logo.png',
    '64': 'icon/logo.png',
    '128': 'icon/logo.png'
  },
  action: {
    default_title: 'chrome demo',
    default_popup: './index.html',
    default_icon: {
      '16': 'icon/logo.png',
      '32': 'icon/logo.png',
      '48': 'icon/logo.png',
      '64': 'icon/logo.png',
      '128': 'icon/logo.png'
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
