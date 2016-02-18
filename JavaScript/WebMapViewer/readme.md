#Feature Service Viewer Issue

## Steps to Reproduce:

1. Go to ArcGIS Developer site and generate a token for you app. Replace the token in `oauth.js` with your token. 
2. App is currently configured to pull all content from a user `jrmwillis`. Replace this with a user that has Web Maps with `access` set to `org` again in `oauth.js`
3. Provide `appId`
4. Click Sign-In
5. App will load with a list of Web Maps to select, and will load the default map. 
    - Open your JS console and switch between maps. No issues. 
6. Click 'Re-register token'
7. Switch the map again and see `Error: You do not have permissions to access this resource or perform this operation.` in the console.

## Notes

#### Not Actually Broken

As I mentioned, this simpler case does fail gracefully and recover from the error. In our case, it does not. The error message and steps to reproduce are the same. 

#### Destroying the Map

In the updated `loadMap()` function, you'll see that I'm calling `destroy()` on the map. It's only when I want to re-use the same DOM element that this throws an error. That is, if I add a NEW map to the document, it works fine.  

