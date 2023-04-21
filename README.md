# infogram
A full stack social media appllication.
Build with node js & react.<br>

<hr>
<b>API Routes:</b>

1- Auth routes <br>
/auth/register --> to register user<br>
/auth/login --> to login user<br>

2- Users routes<br>
/users/:id --> to find user by id<br>
/users/:id/friends --> to find user friends<br>
/users/:id/:friendId --> to add a friend to a user<br>

3- Posts routes<br>
/posts --> to get all feed posts<br>
/posts/:userId/posts --> to get user posts<br>
/posts/:id/like [ send user id in body ]  --> to like a post <br>

<hr>