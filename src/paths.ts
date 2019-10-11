import qs from 'querystring';

const supportEmail = 'dsausatech@gmail.com';
const gitlabEmail = 'incoming+dsausa-issue-tracker-11284343-issue-@incoming.gitlab.com';
const emailParams = qs.stringify({
  cc: supportEmail,
  subject: 'Report an issue',
  body: `
Please note that we cannot make any promises to get around to fixing this issue quickly; we have limited capacity as
a group and will try to review your request as soon as we can.

Is this a feature request or bug report?

ANSWER HERE

What DSA website or application is this report for?

ANSWER HERE

Please provide details about your request below.

ANSWER HERE
  `.trim(),
});

const paths = {
  navbarLinks: [
    {
      text: 'Opt-in Website',
      link: 'https://optin.dsausa.org',
    },
    {
      text: 'Volunteer Signup Form',
      link:
        'https://docs.google.com/forms/d/e/1FAIpQLSeDuRP62PN2yisw-4r513dYCZJFaqRKBcQjcV7JR0hjepiSzg/viewform',
    },
    {
      text: 'Help Form',
      link:
        'https://docs.google.com/forms/d/e/1FAIpQLSejt71aXXUjH0l0Nj1SnvV1KuhJ66N9Dfih4EiLu5W151H_Uw/viewform',
    },
    { text: 'Report an Issue', link: `mailto:${gitlabEmail}?${emailParams}` },
    { text: 'Email Us', link: `mailto:${supportEmail}` },
  ],
};

export default paths;
