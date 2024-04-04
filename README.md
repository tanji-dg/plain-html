# BeeOnLion Website Repository

Welcome to the official repository for the BeeOnLion website. This repository hosts the code that powers our site. Built with simplicity and efficiency in mind, we've used a diverse set of tools to ensure our message reaches our audience.

## About the Website

The BeeOnLion website was crafted using [Mobirise](https://mobirise.com/), a user-friendly platform for building beautiful websites with simple HTML. After creating the site, we've utilised GitLab Pages for hosting, demonstrating that you do not need to pay for expensive hosting if you just want to get on line. 
We have done this in order to showcase our ability to leverage different technologies to meet our project's needs.

### Key Features:

- **Simple HTML:** The core of the BeeOnLion website is built with simple, clean HTML code generated through Mobirise, ensuring fast loading times and compatibility.
- **GitLab Pages:** Our choice for hosting, GitLab Pages allows for seamless integration with our code repository, making updates and maintenance straightforward.

## Beyond Simple HTML

While the BeeOnLion website utilizes simple HTML, we want to emphasise our expertise in a variety of content management systems and web development frameworks. Whether you're looking for a static site or a dynamic web application, our team has the skills and experience to bring your project to life.

### Our Expertise:

- **WordPress:** As the world's most popular CMS, WordPress offers flexibility and a vast ecosystem of themes and plugins. We can create a custom, dynamic website that's easy to manage and scale.
- **Drupal:** For those needing a more robust and secure platform, Drupal provides powerful content management capabilities and is highly customizable, making it ideal for complex websites and web applications.
- **Hugo:** If speed and efficiency are your priorities, Hugo is a static site generator that allows for lightning-fast websites with minimal overhead.

## Let Us Help You Get Online

With a wide range of web development technologies. Whether you prefer the simplicity of HTML or the advanced features of CMS platforms like WordPress and Drupal, or even static site generators like Hugo, we are here to help.

We understand that every project is unique, and we're committed to finding the best solution to get your message across to the public. If you're looking to build or upgrade your website, don't hesitate to reach out. We're excited to work with you to bring your vision online.

---

For inquiries or to discuss your project, please contact us through [our website](https://beeonlion.ie/)












<details><summary>Default README Data from GitLab</summary>






Example plain HTML site using GitLab Pages.

Learn more about GitLab Pages at https://pages.gitlab.io and the official
documentation https://docs.gitlab.com/ce/user/project/pages/.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [GitLab CI](#gitlab-ci)
- [GitLab User or Group Pages](#gitlab-user-or-group-pages)
- [Did you fork this project?](#did-you-fork-this-project)
- [Troubleshooting](#troubleshooting)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## GitLab CI

This project's static Pages are built by [GitLab CI][ci], following the steps
defined in [`.gitlab-ci.yml`](.gitlab-ci.yml):

```yml
image: busybox

pages:
  stage: deploy
  script:
  - echo 'Nothing to do...'
  artifacts:
    paths:
    - public
    expire_in: 1 day
  rules:
    - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
```

The above example expects to put all your HTML files in the `public/` directory.

## GitLab User or Group Pages

To use this project as your user/group website, you will need one additional
step: just rename your project to `namespace.gitlab.io`, where `namespace` is
your `username` or `groupname`. This can be done by navigating to your
project's **Settings**.

Read more about [user/group Pages][userpages] and [project Pages][projpages].

## Did you fork this project?

If you forked this project for your own use, please go to your project's
**Settings** and remove the forking relationship, which won't be necessary
unless you want to contribute back to the upstream project.

## Troubleshooting

1. CSS is missing! That means that you have wrongly set up the CSS URL in your
   HTML files. Have a look at the [index.html] for an example.

[ci]: https://about.gitlab.com/solutions/continuous-integration/
[index.html]: https://gitlab.com/pages/plain-html/-/blob/main/public/index.html
[userpages]: https://docs.gitlab.com/ee/user/project/pages/introduction.html#gitlab-pages-in-projects-and-groups
[projpages]: https://docs.gitlab.com/ee/user/project/pages/introduction.html#gitlab-pages-in-projects-and-groups
</details>