# React-shop-cloudfront
This is frontend starter project for nodejs-aws mentoring program.

- CloudFront URL: [https://d2hgeezc9ch2tg.cloudfront.net/](https://d2hgeezc9ch2tg.cloudfront.net/)
- S3 Bucket URL: [http://cdkstack3rd-spabucket48e1059f-jikkkrgo0fh1.s3-website-us-east-1.amazonaws.com/
](http://cdkstack3rd-spabucket48e1059f-jikkkrgo0fh1.s3-website-us-east-1.amazonaws.com/
)

> Note: S3 static website hosting is not configured for this bucket.
> Direct access returns:
> `NoSuchWebsiteConfiguration (404)`.
> Application is served via CloudFront distribution.

> The bucket itself exists (otherwise AWS would return `NoSuchBucket (404)`),
> but it is private and used only as a CloudFront origin via OAC.
> The application must be accessed through CloudFront.

## Available Scripts

# Infra(cdk)
* `npm run infra:synth`   synthesize CloudFormation template
* `npm run infra:deploy`  deploy stack to AWS
* `npm run infra:destroy` destroy stack in AWS

# SPA
* `start` Starts the project in dev mode with mocked API on local environment.
* `build` Builds the project for production in `dist` folder.
* `preview` Starts the project in production mode on local environment.
* `test`, `test:ui`, `test:coverage` Runs tests in console, in browser or with coverage.
* `lint`, `prettier` Runs linting and formatting for all files in `src` folder.

## Tech Stack

- [Vite](https://vitejs.dev/) as a project bundler
- [React](https://beta.reactjs.org/) as a frontend framework
- [React-router-dom](https://reactrouterdotcom.fly.dev/) as a routing library
- [MUI](https://mui.com/) as a UI framework
- [React-query](https://react-query-v3.tanstack.com/) as a data fetching library
- [Formik](https://formik.org/) as a form library
- [Yup](https://github.com/jquense/yup) as a validation schema
- [Vitest](https://vitest.dev/) as a test runner
- [MSW](https://mswjs.io/) as an API mocking library
- [Eslint](https://eslint.org/) as a code linting tool
- [Prettier](https://prettier.io/) as a code formatting tool
- [TypeScript](https://www.typescriptlang.org/) as a type checking tool