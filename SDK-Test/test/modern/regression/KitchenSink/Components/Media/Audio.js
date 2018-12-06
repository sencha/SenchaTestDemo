/**
 * @file Audio.js
 * @date 31.8.2016
 *
 * On touch devices it is not possible how to control audio, because restriction in browsers.
 * Tested on: iOS9 phone, iOS9 tablet, Android6 phone, Android6 tablet, Chrome, Firefox, Opera, Edge on WinPhone
 * Passed on: all tested
 */
describe('Audio example', function () {
    var Cmp = {
        audio: function () {
            return ST.component('audio');
        }
    };
    var El = {
        audio: function () {
            return ST.element('>> audio');
        }
    };

    beforeAll(function() {
        Lib.beforeAll("#audio-basic", "#kitchensink-view-media-audio");
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-media-audio");
    });

    it('is loaded properly', function () {
        Cmp.audio()
            .rendered()

    });

    it('screenshot should be same', function(){
        //Hardcoded wait for being sure, that audio is already loaded
        ST.wait(1000);
        Lib.screenshot("modern_Audio");
    });

    if (Lib.isDesktop) {
        describe('Audio', function () {
            //after tests audio should be paused, because if you run just test for play, it never stops itself (JZ)
            afterAll(function(){
                El.audio()
                    .and(function (video) {
                        if(!audio.dom.paused) {
                            audio.dom.pause();
                        }
                    });
            });

            it('is playing via HTML5 audio .play() and currentTime is greater than 1.5s', function () {
                El.audio()
                    .and(function (audio) {
                        audio.dom.play();
                        //it is better to have waiting like this than hardcoded 2000ms, because it takes some time to
                        //start play audio - on IE11 and Edge browser fails sometimes when computer is little bit more
                        //busy than just play test for just one browser... (JZ)
                        ST.wait(function(){
                            return (audio.dom.currentTime > 1.5);
                        });
                    })
                    .and(function (audio) {
                        expect(audio.dom.currentTime).toBeGreaterThan(1.500);
                    });
            });

            it('is paused via HTML5 audio .pause() after 1.5s', function () {
                El.audio()
                    .and(function (audio) {
                        audio.dom.play();
                        //it is better to verify, that audio started to play for provided pause like this, rather than hardcoded time (JZ)
                        ST.wait(function(){
                            return (audio.dom.currentTime > 1.5);
                        });
                    })
                    .and(function (audio) {
                        audio.dom.pause();
                        expect(audio.dom.paused).toBeTruthy();
                    });
            });

            it('property audio.error is not defined = no error on audio', function () {
                El.audio()
                    .and(function (audio) {
                        expect(audio.error).not.toBeDefined();
                    });
            });
        });
    } else {
        describe('Audio', function () {
            it('is playing via HTML5 audio .play() and currentTime is greater than 1.5s', function () {
                pending('HTML5 audio methods are forbidden on touch devices');
            });
        });
    }

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('Audio');
        });
    });
});


