import auth from '@react-native-firebase/auth';

export function userLogout(): Promise<string> {
    return new Promise((resolve, reject) => {
        auth()
            .signOut()
            .then(() => {
                resolve('Logout Successful');
            })
            .catch(error => {
                reject({
                    title: 'Error',
                    desc: error.message,
                });
            });
    });
}