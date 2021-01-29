# Welcome to Quick Trainer!

This project was built with love for my Capstone with the Flatiron SE program.  I have worked in the fitness industry for several years, and I have seen a niche market for individuals who are specifically interested in exercise programs from a personal trainer, but who (for a multitude of reasons) do not wish to partake in 1:1 personal training.  By creating a platform for clients to meet coaches, we can help coaches expand their market, and help clients gain access to fitness professionals.  This platform would also be a great compliment to fitness professionals who already have a social media presence, as it would be a central hub to provide programming and advice to clients.

**This was recently completed, and a video demonstration is to come**

## Instructions

1. Fork and clone this repo, as well as the [Backend API](https://github.com/AlecGrey/quick-trainer-backend).
2. Begin by installing all necessary Gems with `bundle install` in the Backend directory.
3. Do the same with the Frontend, using `yarn install`.
4. To start the web application, first seed the database by running `rails db:seed` from the Backend directory.  Once that is complete, spin-up the server with `rails s`.  Finally, navigate to the Frontend directory and run `yarn start`.  This should open up your browser to the homepage!

### For use:

You can start with your own account, or log in to any of the seeded users.  For example, 'Tony Horton' is an instantiated trainer account that you can log in with the password of 'password'.

### Things to try:

1. Add a new training agreement, then log in as the coach (they all have a password of 'password') and accept the agreement!
2. Write yourself a workout as a coach!
3. Export the PDF as a client, and rate the workout!
4. Check-out the chat feed at the bottom.  Open a second window and place it side-by-side with your client on one account and your coach on the other (You may need an icognito window to do this).  Open up both of your chat feeds (in the bottom-right corner) and open a new feed with your coach and client.  Watch how the page updates in real time to new chat messages!

## Contributors

This project was developed by Alexander Grey.  I am happy to accept contributors, so please send me a request if you are interested!

## Licence

License Copyright 2021 Alexander Grey

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
