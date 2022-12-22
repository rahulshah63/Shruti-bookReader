# Shruti React Native App

#### Title: `Shruti React Native App`

#### Description: `Application for AudioBook`

#### Author: `Quadruples`

## 🚀 How to Run

```sh
npm install -g expo-cli
npm install or yarn install
expo start
```

## Steps to Run Nepali Tacotron Model (For Linux)

1. Move to Tacotron folder

   `cd tacotron`

2. Create and activate a virtual environment in python3.6(we have been using deprecated version for this case)

   ```
   sudo apt install python3-venv
   python3.6 -m venv tacotron-env
   source tacotron-env/bin/activate
   ```

3. Confirm python version

   ` python3 --version`

   You should see `Python 3.6.15`

All the following happens in the virtual environment

4. Install tensorflow 1.4.0 (It is a veryyy old version, but it is what works on this code. We need to update it when we have time)

   `pip install tensorflow==1.4.0`

Upgrade the pip if the terminal demands

5. Install the requirements

   `pip install -r requirements.txt`

6. For the error `unexpected keyword argument 'jitdebug' `, deprecate the version of llvmlite to 0.32.1

   `pip install -U llvmlite==0.32.1`

7. Run the demo server

   `python3 demo_server.py --checkpoint ./tacotron-nepali/model.ckpt-75000`

8. Point the browser at localhost:9000
