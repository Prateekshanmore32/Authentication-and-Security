# Authentication and Security<br>
## **Level 1: Username and Password** <br>
When the user tries to register by giving a username/email and password we are going to save those credentials into our database and will render the secret page. And when the same user tries to log in after creating an account we are going to check those credentials against our database. If they match we'll render the secret page otherwise not.
But the disadvantage of using level 1 authentication is that we can see our user's password in plain text inside our database, which is pretty bad.<br><br>
## **Level 2: Encryption** <br>
To add some level of security we can leverage something called encryption.
Here, we can use an npm package called [mongoose-encryption](https://www.npmjs.com/package/mongoose-encryption). This uses the AES algorithm for encryption and decryption. <br>
Steps:<br>
1. npm i mongoose-encryption<br>
2. const encrypt = require('mongoose-encryption')<br>
3. const userSchema = new mongoose.Schema({
 email:String,
 password:String
})<br>
4. Create your secret eg, const secret ="qwertyqwertyqwerty"<br>
5. Add this as a plugin to your schema<br>
userSchema.plugin(encrypt, { secret: secret });
6. Here we just wanted to encrypt user's password. So we need to specify that by including only certain fields 
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });<br>
Do this before creating your model. Now we are good to go. Mongoose encryption will encrypt(when the credentials will get saved to DB) and decrypt(when we are trying to find the credentials from the DB) the password behind the scene. Don't forget to add your secret into a .env file and add it to gitignore :) <br><br>
## **Level 3: Hashing**<br>
Although in level 2 we have achieved some level of security but still there are chances that our system is not that secured. What if someone somehow gets access to the "Key" that we have used for encryption and decryption? That person can then get to know about the passwords of our users. One of the solutions is to not use the "Key". Instead, we can use a Hashing function. 
The Hashing Function will convert the password into a hash value. And it is almost impossible to convert that hash value back to normal text/password. 
So, when the user registers with their username and password, we will convert the password into a hash value and save it inside our database. and when the user tries to log in with their username and password we will convert that password into a hash and compare it against the value stored inside the database.
Hash Function always generates the same hash for the same plain text.
Here we'll use the [md5](https://www.npmjs.com/package/md5) npm package for hashing our passwords.<br>
Steps,<br>
step 1: npm i md5<br>
step 2: const md5 = require('md5')<br>
step 3:md5(message)<br>
