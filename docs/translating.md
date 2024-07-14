# Translating for MCCreations
Is a language you speak missing from MCCreations? In this short guide we'll explain how to add it! All translations are community provided, so a huge thank you to anyone who as provided some!

If you need any help with anything on this guide, don't hesitate to send us a ping on Discord, which you can join here: https://discord.com/invite/HQSnKGf

## Adding a New Language
The first step in adding a new language is figuring out the correct code for your language. Our language codes are currently structured just like Minecaft, the first two characters are the first two characters of the language and the last two are the abbreviation of the country it's spoken in. 
Some examples: 
- United States English -> en-US
- France French -> fr-FR
- Mexican Spanish -> es_MX

If you're confused, or don't know the code for your language just make one up! Just make sure to make it clear which language and which country you're trying to add once you're ready to PR.

Next, you need to create a fork of the `mccreations-next` repository. Don't worry, it may sound confusing but it's really easy. 
1. Go the the `Code` tab above
2. Find the `Fork` button on the top right
3. Keep all the defaults in the dialogue that pops up and hit `Create Fork`

<img width="1694" alt="Screenshot 2024-07-13 at 8 05 38 PM" src="https://github.com/user-attachments/assets/093ad8d8-43ae-4f61-ac8d-c322fc262a27">


Now you have your own little personal copy of MCCreations!

Once that finishes creating, find the `locales` folder in the repository. 

<img width="1363" alt="Screenshot 2024-07-13 at 8 09 54 PM" src="https://github.com/user-attachments/assets/9fa51df7-23fb-4f64-9bee-e16482ae266f">


Navigate to `locales/langs/en-US.ts`, it should look like the photo below. Download the file with the download button in the top right

<img width="1424" alt="Screenshot 2024-07-13 at 8 10 25 PM" src="https://github.com/user-attachments/assets/29da306d-ba68-4e7b-967f-a489d0fbbfae">


Now that file is on your computer, change the name to whatever language code you decided on above. Remember, it doesn't have to 100% follow those rules as long as it's clear which language and country you're translating for.

Next, open the file and start translating! Don't change anything before the `:` (that's how the website knows what text to grab) but anything after the `:` is fair game!

<img width="1074" alt="Screenshot 2024-07-13 at 8 17 33 PM" src="https://github.com/user-attachments/assets/f6ecb5ce-7920-40d8-bd63-a7e13baebf7b">


Once you're done, go back to `locales/langs` on your fork and click `Add File` and then `Upload Files` in the top right.

<img width="1423" alt="Screenshot 2024-07-13 at 8 12 52 PM" src="https://github.com/user-attachments/assets/7a120012-f434-4a20-8753-3246920d899b">


Upload your file, and then write which language and country you're uploading a language for in the top text box. Leave the rest of the settings and press `Commit Changes`

<img width="1243" alt="Screenshot 2024-07-13 at 8 23 22 PM" src="https://github.com/user-attachments/assets/15bfb20f-9ff3-4154-b41b-7b5adc5910f5">


Once it finishes uploading, a new button should have appeared on the homepage that says `Contribute` click it and then hit `Open Pull Request`

<img width="497" alt="Screenshot 2024-07-13 at 8 27 21 PM" src="https://github.com/user-attachments/assets/009283ea-9949-455d-a936-b6c3dcdf5c0a">

On the Pull Request screen, simply write a title that says which file you added and then hit `Create Pull Request` and you're done!

<img width="1338" alt="Screenshot 2024-07-13 at 8 32 32 PM" src="https://github.com/user-attachments/assets/9cae7f98-6022-4012-8bf5-264f9bac3fa8">


## Updating an Existing Language

Updating an existing language is a little easier, but requires many of the same steps. First you need to create a fork of the `mccreations-next` repository. Don't worry, it may sound confusing but it's really easy. 
1. Go the the `Code` tab above
2. Find the `Fork` button on the top right
3. Keep all the defaults in the dialogue that pops up and hit `Create Fork`

<img width="1694" alt="Screenshot 2024-07-13 at 8 05 38 PM" src="https://github.com/user-attachments/assets/093ad8d8-43ae-4f61-ac8d-c322fc262a27">


Now you have your own little personal copy of MCCreations!

Once that finishes creating, find the `locales` folder in the repository. 

<img width="1363" alt="Screenshot 2024-07-13 at 8 09 54 PM" src="https://github.com/user-attachments/assets/9fa51df7-23fb-4f64-9bee-e16482ae266f">


In `locales/lang` find the language you want to edit and then start editing it with the `Edit` button in the top right

<img width="1419" alt="Screenshot 2024-07-13 at 8 38 01 PM" src="https://github.com/user-attachments/assets/37678a16-6c8d-49e3-9c4b-0f19661fbfa2">


Once you're done, hit `Comit Changes` in the top right, keep all the default values in the window that shows up and hit `Comit Changes` again

<img width="1419" alt="Screenshot 2024-07-13 at 8 38 47 PM" src="https://github.com/user-attachments/assets/8089fe14-dc28-4b8d-b68e-85c9394e397f">


A new button should have appeared on the homepage that says `Contribute` click it and then hit `Open Pull Request`

<img width="497" alt="Screenshot 2024-07-13 at 8 27 21 PM" src="https://github.com/user-attachments/assets/009283ea-9949-455d-a936-b6c3dcdf5c0a">

On the Pull Request screen, simply write a title that says which file you added and then hit `Create Pull Request` and you're done!

<img width="1338" alt="Screenshot 2024-07-13 at 8 32 32 PM" src="https://github.com/user-attachments/assets/9cae7f98-6022-4012-8bf5-264f9bac3fa8">
