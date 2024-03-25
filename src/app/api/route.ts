import crypto from "node:crypto";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const timeStamp = query.get('timeStamp');
  const nonceStr = query.get('nonceStr');
  const openAppID = query.get('openAppID');
  const url = query.get('url');

  console.log('openAppID',openAppID)

  const access_token = await (await fetch('https://api.weixin.qq.com/cgi-bin/stable_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      body: JSON.stringify({
        grant_type: 'client_credential',
        appid: openAppID,
        secret: '',
        force_refresh: true
      })
    }
  })).json();
  console.log('access_token',access_token)

  const ticket = await (await fetch(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`, {
    method: 'GET'
  })).json();
  console.log('ticket',ticket)

  const string = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timeStamp}&url=${url}`
  const signature = crypto.createHash('sha1').update(string).digest('hex')

  return Response.json({ signature })
}