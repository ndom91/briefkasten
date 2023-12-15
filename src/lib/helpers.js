export const prepareBase64DataUrl = (base64) => base64.replace(/^.+,/, "")

export const asyncFileReader = async (blob) => {
  if (typeof window !== "undefined") {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader()
        reader.onload = function () {
          resolve(this.result)
        }
        reader.readAsDataURL(blob)
      } catch (e) {
        reject(e)
      }
    })
  } else {
    const buffer = Buffer.from(await blob.arrayBuffer())
    return `data:image/png;bas64,${buffer.toString("base64")}`
  }
}

export const perf = () => {
  return { now: () => new Date().getTime() }
}

export const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => i + start)
}

export const serverTiming = {
  timings: {},
  start: () => {
    serverTiming.timings = {
      total: {
        start: perf().now(),
      },
    }
  },
  measure: (name, desc) => {
    const now = perf().now()
    if (serverTiming.timings[name]?.start) {
      serverTiming.timings[name].end = now
      serverTiming.timings[name].dur = now - serverTiming.timings[name].start
      if (desc) serverTiming.timings[name].desc = desc
    } else {
      serverTiming.timings[name] = { start: now }
      if (desc) serverTiming.timings[name].desc = desc
    }
  },
  setHeader: () => {
    serverTiming.measure("total")
    return Object.entries(serverTiming.timings)
      .map(([name, measurements]) => {
        return `${name};${measurements.desc ? `desc="${measurements.desc}";` : ""}dur=${
          measurements.dur
        }`
      })
      .join(",")
  },
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
export function html(params) {
  const { url, theme } = params

  const brandColor = theme.brandColor || "#346df1"
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: "#1e293b",
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  }

  return `
    <body>
      <table style="width:100%;background-color:#ffffff" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
        <tbody>
          <tr>
            <td>
              <div><!--[if mso | IE]>
                <table role="presentation" width="100%" align="center" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;width:560px;"><tr><td></td><td style="width:37.5em;background:#ffffff">
              <![endif]--></div>
              <div style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;width:560px">
                <h1 style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#484848;padding:17px 0 0;display:flex;align-items:center;">
                  <img height="42" width="42" src="https://raw.githubusercontent.com/ndom91/briefkasten/main/public/favicon/favicon-32x32.png" style="margin-right: 10px;" alt="Briefkasten Logo" />
                  <strong>Briefkasten</strong>
                </h1>
                <table style="width:100%;padding:27px 0 27px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody>
                    <tr>
                      <td><a href="${url}" target="_blank" style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;background-color:${color.buttonBackground};border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;p-x:23px;p-y:11px;line-height:100%;max-width:100%;padding:11px 23px"><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%;mso-text-raise:16.5" hidden>&nbsp;</i><![endif]--></span><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;background-color:${color.buttonBackground};border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;p-x:23px;p-y:11px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:8.25px">Login to Briefkasten</span><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:15px;line-height:1.4;margin:0 0 15px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;color:#3c4149">This link will only be valid for the next 60 minutes. If the link does not work, you can request another one on the login page.</p>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" /><a target="_blank" style="color:#b4becc;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px" href="https://briefkastenhq.com">Briefkasten</a>
              </div>
              <div><!--[if mso | IE]>
              </td><td></td></tr></table>
              <![endif]--></div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  `

  //   return `
  // <body style="background: ${color.background};height:500px;padding-top:100px;">
  //   <table width="100%" border="0" cellspacing="20" cellpadding="0"
  //     style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px; padding: 30px;">
  //     <tr>
  //       <td align="center"
  //         style="padding: 5px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};display:flex;justify-content:center;">
  //         <img height="32" width="32" src="https://raw.githubusercontent.com/ndom91/briefkasten/main/public/favicon/favicon-32x32.png" style="margin-right: 10px;" alt="Briefkasten Logo" />
  //         <strong>Briefkasten</strong>
  //       </td>
  //     </tr>
  //     <tr>
  //       <td align="center" style="padding: 10px 0;">
  //         <table border="0" cellspacing="10" cellpadding="0">
  //           <tr>
  //             <td align="center">
  //               <div style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${color.text}; display: inline-block;">
  //                 Click below to directly sign-in to <strong>briefkastenhq.com</strong>.
  //               </div>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td align="center">
  //               <a href="${url}"
  //                 target="_blank"
  //                 style="width: 100%; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; background-color: ${color.buttonBackground}; display: inline-block; font-weight: bold;">Sign
  //                 in</a></td>
  //           </tr>
  //         </table>
  //       </td>
  //     </tr>
  //     <tr>
  //       <td align="center"
  //         style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
  //         If you did not request this email you can safely ignore it.
  //       </td>
  //     </tr>
  //   </table>
  // </body>
  // `
}

export const isAbsoluteUrl = (url) => /^[a-z][a-z0-9+.-]*:/.test(url)
