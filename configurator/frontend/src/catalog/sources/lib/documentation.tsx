import * as React from 'react';

export const googleProjectCreation = <>
  At first, create or select Google project:
  <ul>
    <li>Go to the <a href="https://console.developers.google.com/">API Console page</a></li>
    <li>Click "Select Project" if you have already had a project or click "Create Project" if not</li>
  </ul>
  Read more about <a href="https://support.google.com/googleapi/answer/6251787?hl=en#zippy=%2Ccreate-a-project">How to create Google project</a>
</>

export type DocumentationParams = {
  oauthEnabled?: boolean,
  serviceName: string
  serviceAccountEnabled?: boolean
  scopes?: string[]
  apis: string[]
}

export function googleServiceAuthDocumentation({ oauthEnabled = false, scopes = [], serviceAccountEnabled = true, serviceName, apis }: DocumentationParams) {
  const scopeStr = scopes.join(' ');
  return <>
    Following authorization methods are available for <b>{serviceName}</b>
    <ul>
      {oauthEnabled && <li><b>OAuth</b> — you'll need to provide Client Secret / Client Id (you can obtain in in <a href="https://console.cloud.google.com/">Google Cloud Console</a>) and get a refresh token. Jitsu developed
        a small <a href="https://github.com/jitsucom/oauthcli">CLI utility for obtaining the token</a></li>}
      {serviceAccountEnabled && <li><b>Service Account</b> — you'll a) <a href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys">create a service account in Google Cloud Console</a>
        {' '} b) share google resource (such as document or analytics property) with this account (account email look like <code>[username]@jitsu-customers.iam.gserviceaccount.com</code>) c)
        {' '} put Service Account Key JSON (available in Google Cloud Console) in the field below
      </li>}
    </ul>
    You should also enable Google API for your project. Go to the <a href="https://console.cloud.google.com/apis/library">Google APIs Library page</a>, search
    {apis.map(api => <b>{api}</b>).join(' and ')} and make sure they are enabled

    {oauthEnabled && <>
      <h1>1. Obtaining access through <b>OAuth</b></h1>
      Jitsu requires 3 parameters for accessing {serviceName}:
      <ul>
        <li><code>client_id</code> - An unique client identifier that is obtained from <a href="https://console.cloud.google.com/">Google Cloud Console</a></li>
        <li><code>client_secret</code> - A client secret string that is obtained from <a href="https://console.cloud.google.com/">Google Cloud Console</a></li>
        <li><code>refresh_token</code> - Access token. It could be generated by <a href="https://github.com/jitsucom/oauthcli">jitsucom/oauthcli</a></li>
      </ul>
      <h2>Getting <code>client_id</code> and <code>client_secret</code></h2>
      <ul>
        <li>Go to the <a href="https://console.cloud.google.com/apis/credentials">API Credentials page</a></li>
        <li>Click "+ Create Credentials" ➞ "OAuth client ID" ➞ select <i>Desktop app</i> as application type</li>
        <li>Note: If you haven't configured OAuth Consent Screen yet, Google asks to configure it. The screen type should be 'External'</li>
      </ul>
      <h2>Getting <code>refresh_token</code></h2>
      Copy Client ID and Client Secret parameters, use them for generating refresh token with <a href="https://github.com/jitsucom/oauthcli">jitsucom/oauthcli</a> tool:
      <p>
        <code>./authorizer.py --client_id={'<YOUR CLIENT ID>'} --client_secret={'<YOUR CLIENT SECRET>'} --scope='{scopeStr}'</code>
      </p>
    </>}
    {serviceAccountEnabled && <>
      <h1>2. Obtaining access through <b>Service Account</b></h1>
      <p>At first, create or select Google project. There is a <a href="https://support.google.com/googleapi/answer/6251787?hl=en#zippy=%2Ccreate-a-project">good manual on how to do that</a></p>
      <p>Then create a new <a href="https://cloud.google.com/iam/docs/creating-managing-service-accounts"><b>Google Service Account</b></a>: </p>
      <ul>
        <li>Go to the <a href="https://console.developers.google.com/iam-admin/serviceaccounts">Service Accounts page</a></li>
        <li>Click "+ Create Service Account"</li>
        <li>Click on created row in Service Accounts table, go to "KEYS" tab</li>
        <li>Click "ADD KEY" ➞ "Create new key" ➞ Select JSON ➞ "CREATE"</li>
        <li>Service Account JSON (private key) will be in downloaded file</li>
      </ul>
    </>}
  </>
}
