export function doNotify(message, user) {
    Notification.requestPermission().then(function (result) {
        console.log(result)
        let sound = new Audio('./assets/woodblock.mp3')
        let notification = new Notification('Atable Message', {
            'body': `${user}: ${message}`,
            'icon': './assets/icons/atablePng.png',
        });
        sound.play();
    });
}