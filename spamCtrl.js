let spamming = false;
let spamChannel = undefined;

// spam function repeats until variable spamming is false
function spam() {
    return new Promise((resolve, reject) => {

        // add check to make sure discord channel exists
        if (!spamChannel)
            reject('Channel is undefined!');

        // send message on spam channel
        spamChannel.send('spam :P')
        .then(msg => {
            // wait 100 ms until sending next spam message
            setTimeout(() => {
                // continue spamming if spamming variable is true
                if (spamming) {
                    spam()
                    .then(resolve) // not entirely necessary, but good practice
                    .catch(console.log); // log error to console in case one shows up
                }

                // otherwise, just resolve promise to end this looping
                else {
                    resolve();
                }
            }, 100)
        })
        .catch(console.log);

    });
}

// public functions that will be used in your index.js file
module.exports = {
    // pass in discord.js channel for spam function
    setChannel: function(channel) {
        spamChannel = channel;
    },

    // set spam status (true = start spamming, false = stop spamming)
    setStatus: function (statusFlag) {
        // get current status
        let currentStatus = spamming;

        // update spamming flag
        spamming = statusFlag;

        // if spamming should start, and it hasn't started already, call spam()
        if (statusFlag && currentStatus != statusFlag) {
            spam();
        }
    },

    // not used in my commands, but you may find this useful somewhere
    getStatus: function() {
        return spamming;
    }
};
