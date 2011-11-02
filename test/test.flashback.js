$(function() {
    module('initiating the flashback plugin');
    test('flashback is added to the data of the object it was called on', function() {
        ok($(document).flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a document flashback');
        equal(JSON.stringify($(document).data("Flashback").options), "{\"autoSaveInterval\":0,\"autoSaveUnload\":false,\"useLocalStorage\":true,\"expires\":2}", 'Flashback object exists in document data');
    });

    test('flashback called on multiple objects shares the same instantiated options', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        equal(JSON.stringify($('form:first').data("Flashback").options), "{\"autoSaveInterval\":0,\"autoSaveUnload\":false,\"useLocalStorage\":true,\"expires\":2}", 'first instantiation has the same instantiated options');
        equal(JSON.stringify($('form:last').data("Flashback").options), "{\"autoSaveInterval\":0,\"autoSaveUnload\":false,\"useLocalStorage\":true,\"expires\":2}", 'second instantiation has the same instantiated options');
    });

    module('flashback public function: save()');
    test('will save data using localstorage', function() {
        ok($(document).flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($(document).data("Flashback").options.useLocalStorage, 'flashback set to use localstorage')
        ok($(document).flashback('save'), 'save all forms');

        ok(localStorage.fb, 'localStorage flashback object exists');
        var fb_json = JSON.parse(localStorage.fb);
        ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
        ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');
    });

    test('will save data using localstorage', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($('form').flashback('save'), 'save all forms');
        ok($('form').data("Flashback").options.useLocalStorage, 'flashback set to use localstorage')

        ok(localStorage.fb, 'localStorage flashback object exists');
        var fb_json = JSON.parse(localStorage.fb);
        ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
        ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');
    });

    test('will save data using a cookie', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: false, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok(!$('form').data("Flashback").options.useLocalStorage, 'flashback set to use cookies')
        ok($('form').flashback('save'), 'save all the forms');

        ok($.cookie('fb'), 'flashback cookie object exists');
        var fb_json = JSON.parse($.cookie('fb'));
        ok(fb_json.fb_1, 'flashback cookie object for form 1 exists');
        ok(fb_json.fb_2, 'flashback cookie object for form 2 exists');
    });

    test('will save each form field (form 1) into localstorage', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($('form').data("Flashback").options.useLocalStorage, 'flashback set to use localstorage')
        ok($('form').flashback('save'), 'save all the forms');

        ok(localStorage.fb, 'localStorage flashback object exists');
        var fb_json = JSON.parse(localStorage.fb);
        ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
        ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');

        equals(fb_json.fb_1.FirstName, 'Rick', 'FirstName should be: Rick')
        equals(fb_json.fb_1.LastName, 'Deckard', 'LastName should be: Deckard')
        equals(fb_json.fb_1.occupation, 'I work in the Blade Runner Unit, I administer the Voight-Kampf test to suspected replicants.', 'Occupation should be: I work in the Blade Runner Unit, I administer the Voight-Kampf test to suspected replicants.')
        ok(!fb_json.fb_1.idnumber, 'Password should not be present in the save')
        equals(fb_json.fb_1.type, 'replicant', 'Type should be: replicant')
        equals(fb_json.fb_1.voightkampf, 'myself', 'Voightkampf should be: myself')
        equals(fb_json.fb_1.birthday, 'notaccept', 'Birthday should be: I wouldn\'t accept it.')
    });

    test('will save each form field (form 1) into cookies', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: false, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok(!$('form').data("Flashback").options.useLocalStorage, 'flashback set to use cookies')
        ok($('form').flashback('save'), 'save all the forms');

        ok($.cookie('fb'), 'flashback cookie object exists');
        var fb_json = JSON.parse($.cookie('fb'));
        ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
        ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');

        equals(fb_json.fb_1.FirstName, 'Rick', 'FirstName should be: Rick')
        equals(fb_json.fb_1.LastName, 'Deckard', 'LastName should be: Deckard')
        equals(fb_json.fb_1.occupation, 'I work in the Blade Runner Unit, I administer the Voight-Kampf test to suspected replicants.', 'Occupation should be: I work in the Blade Runner Unit, I administer the Voight-Kampf test to suspected replicants.')
        ok(!fb_json.fb_1.idnumber, 'Password should not be present in the save')
        equals(fb_json.fb_1.type, 'replicant', 'Type should be: replicant')
        equals(fb_json.fb_1.voightkampf, 'myself', 'Voightkampf should be: myself')
        equals(fb_json.fb_1.birthday, 'notaccept', 'Birthday should be: notaccept')
    });

    test('will save each form field (form 2) into localstorage', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($('form').data("Flashback").options.useLocalStorage, 'flashback set to use localstorage')
        ok($('form').flashback('save'), 'save all the forms');

        ok(localStorage.fb, 'localStorage flashback object exists');
        var fb_json = JSON.parse(localStorage.fb);
        ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
        ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');

        equals(fb_json.fb_2.FirstName, 'Obi-Wan', 'FirstName should be: Obi-Wan')
        equals(fb_json.fb_2.LastName, 'Kenobi', 'LastName should be: Kenobi')
        equals(fb_json.fb_2.passengers, 'Myself, the boy, two droids... and no questions asked.')
        ok(!fb_json.fb_2.password, 'Password should not be present in the save')
        equals(fb_json.fb_2.destination, 'alderaan', 'Type should be: alderaan')
        equals(fb_json.fb_2.prescreen, 'yes', 'Voightkampf should be: yes')
        equals(fb_json.fb_2.additionalrequests, 'imperial', 'Birthday should be: imperial')
    });

    test('will save each form field (form 2) into cookies', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: false, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok(!$('form').data("Flashback").options.useLocalStorage, 'flashback set to use cookies')
        ok($('form').flashback('save'), 'save all the forms');

        ok($.cookie('fb'), 'flashback cookie object exists');
        var fb_json = JSON.parse($.cookie('fb'));
        ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
        ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');

        equals(fb_json.fb_2.FirstName, 'Obi-Wan', 'FirstName should be: Obi-Wan')
        equals(fb_json.fb_2.LastName, 'Kenobi', 'LastName should be: Kenobi')
        equals(fb_json.fb_2.passengers, 'Myself, the boy, two droids... and no questions asked.')
        ok(!fb_json.fb_2.password, 'Password should not be present in the save')
        equals(fb_json.fb_2.destination, 'alderaan', 'Type should be: alderaan')
        equals(fb_json.fb_2.prescreen, 'yes', 'Voightkampf should be: yes')
        equals(fb_json.fb_2.additionalrequests, 'imperial', 'Birthday should be: imperial')
    });

    test('will save individual forms, leaving the others untouched', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($('form').data("Flashback").options.useLocalStorage, 'flashback set to use localstorage')
        ok($('form').flashback('save'), 'save all the forms');

        ok(localStorage.fb, 'localStorage flashback object exists');
        var fb_json = JSON.parse(localStorage.fb);
        ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
        ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');

        ok($('form:first [name="FirstName"]').val('Richard'), 'change form 1 first name to Richard');
        equal($('form:first [name="FirstName"]').val(), 'Richard', 'validate change one of the fields in Form 1')

        ok($('form:last [name="FirstName"]').val('Old Ben'), 'change form 2 first name to Old Ben');
        equal($('form:last [name="FirstName"]').val(), 'Old Ben', 'validate change one of the fields in Form 2')

        ok($('form:last').flashback('save'), 'save only the second form');

        fb_json = JSON.parse(localStorage.fb);
        ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
        ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');

        ok(fb_json.fb_2.FirstName, 'Old Ben', 'FirstName should have changed to Old Ben')

        equals(fb_json.fb_1.FirstName, 'Rick', 'FirstName should be: Rick')
        equals(fb_json.fb_1.LastName, 'Deckard', 'LastName should be: Deckard')
        equals(fb_json.fb_1.occupation, 'I work in the Blade Runner Unit, I administer the Voight-Kampf test to suspected replicants.', 'Occupation should be: I work in the Blade Runner Unit, I administer the Voight-Kampf test to suspected replicants.')
        ok(!fb_json.fb_1.idnumber, 'Password should not be present in the save')
        equals(fb_json.fb_1.type, 'replicant', 'Type should be: replicant')
        equals(fb_json.fb_1.voightkampf, 'myself', 'Voightkampf should be: myself')
        equals(fb_json.fb_1.birthday, 'notaccept', 'Birthday should be: I wouldn\'t accept it.')
    });

    module('flashback public function: load()');
    test('will load data back into all forms from localstorage', function(){
        $('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2});
        $('form').flashback('save')
        ok(localStorage.fb, 'localStorage flashback object exists');

        ok($('form:first [name="FirstName"]').removeAttr('value'), 'clear the firstName');
        equal($('form:first [name="firstName"]').val(), undefined, 'firstName should be empty');
        ok($('form').flashback('load'), 'load the forms back from storage');
        equal($('form:first [name="FirstName"]').val(), 'Rick', 'firstName should be Rick');
    });

    test('will load data back into all forms from cookies', function(){
        $('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: false, expires: 2});
        $('form').flashback('save')
        ok($.cookie('fb'), 'flashback cookie object exists');

        ok($('form:first [name="FirstName"]').removeAttr('value'), 'clear the firstName');
        equal($('form:first [name="firstName"]').val(), undefined, 'firstName should be empty');
        ok($('form').flashback('load'), 'load the forms back from storage');
        equal($('form:first [name="FirstName"]').val(), 'Rick', 'firstName should be Rick');
    });

    test('will load data back into all forms', function(){
        $('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2});
        $('form').flashback('save')
        ok(localStorage.fb, 'localStorage flashback object exists');
        ok(clear_forms(), 'clear all the forms');
        notEqual($('form:first [name="firstName"]').val(), 'Rick', 'firstName should be empty form 1');
        notEqual($('form:last [name="firstName"]').val(), 'Obi-Wan', 'firstName should be empty form 2');
        ok($('form').flashback('load'), 'load the forms back from storage');
        equal($('form:first [name="FirstName"]').val(), 'Rick', 'firstName should be Rick');
        equal($('form:last [name="FirstName"]').val(), 'Obi-Wan', 'firstName should be Obi-Wan');
    });

    test('will load specific data back into a specific forms', function(){
        $('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2});
        $('form').flashback('save')
        ok(localStorage.fb, 'localStorage flashback object exists');
        ok(clear_forms(), 'clear all the forms');
        notEqual($('form:first [name="firstName"]').val(), 'Rick', 'firstName should be empty form 1');
        notEqual($('form:last [name="firstName"]').val(), 'Obi-Wan', 'firstName should be empty form 2');
        ok($('form:first').flashback('load'), 'load the forms back from storage');
        equal($('form:first [name="FirstName"]').val(), 'Rick', 'firstName should be Rick');
        notEqual($('form:last [name="FirstName"]').val(), 'Obi-Wan', 'firstName should be Obi-Wan');
    });

    module('flashback public function: clear()');
    test('will remove saves in localStorage', function() {
        ok($(document).flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a document flashback');
        ok($(document).flashback('save'), 'save the forms');
        ok(localStorage.fb, 'localStorage flashback object exists');
        ok($(document).flashback('clear'), 'clear the forms');
        ok(!localStorage.fb, 'localStorage flashback object does not exist');
    })

    test('will remove saves in cookie', function() {
        ok($(document).flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: false, expires: 2}), 'instantiate a document flashback');
        ok($(document).flashback('save'), 'save the forms');
        ok($.cookie('fb'), 'flashback cookie object exists');
        ok($(document).flashback('clear'), 'clear the forms');
        ok(!$.cookie('fb'), 'flashback cookie object does not exist');
    })

    test('will remove individual saves in localStorage', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($('form').flashback('save'), 'save the forms');
        ok(localStorage.fb, 'localStorage flashback object exists');

        ok($('form:first').flashback('clear'), 'clear the first form');
        ok(localStorage.fb, 'localStorage flashback object should still exist');

        var fb_json = JSON.parse(localStorage.fb);
        ok(!fb_json.fb_1, 'flashback localstorage object for form 1 does not exist');
        ok(fb_json.fb_2, 'flashback localstorage object for form 2 exists');
    })

    test('will remove individual saves in the cookie', function() {
        ok($('form').flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: false, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($('form').flashback('save'), 'save the forms');
        ok($.cookie('fb'), 'flashback cookie object exists');

        ok($('form:first').flashback('clear'), 'clear the forms');
        ok($.cookie('fb'), 'flashback cookie object should still exist');

        var fb_json = JSON.parse($.cookie('fb'));
        ok(!fb_json.fb_1, 'flashback cookie object for form 1 should not exist');
        ok(fb_json.fb_2, 'flashback cookie object for form 2 exists');
    })

    module('autoSaveInterval tests:');
    test('0 will not setup the interval', function() {
        ok($(document).flashback({autoSaveInterval: 0, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($(document).data("Flashback").options.useLocalStorage, 'flashback set to use localstorage')
        stop();
        setTimeout(function() {
            ok(!localStorage.fb, 'localStorage flashback object exists');
            start();
        }, 1200);
    })

    test('1000 will save the forms every 1 second', function() {
        ok($(document).flashback({autoSaveInterval: 1000, autoSaveUnload: false, useLocalStorage: true, expires: 2}), 'instantiate a form flashback -- one flashback object on each form');
        ok($(document).data("Flashback").options.useLocalStorage, 'flashback set to use localstorage')
        stop();
        setTimeout(function() {
            ok(localStorage.fb, 'localStorage flashback object exists');
            var fb_json = JSON.parse(localStorage.fb);
            ok(fb_json.fb_1, 'localStorage flashback object for form 1 exists');
            ok(fb_json.fb_2, 'localStorage flashback object for form 2 exists');
            start();
        }, 1200);
    })
});

QUnit.begin = function initialize() {
    QUnit.testDone();
}

QUnit.testDone = function teardown(data) {
    clear_cookies();
    delete localStorage.fb
    $('form').each(function() { $(this).removeData("Flashback"); });
    $(document).removeData("Flashback");
}

function clear_cookies() {
    if (document.cookie != "") {
        var saves = document.cookie.split('; ');
        for (var save in saves) {
            var id = saves[save].split('=')[0];
            $.cookie(id, null);
        }
    }
}

function clear_forms() {
    $('form').find('input, select, textarea').each(function() {
        $(this).removeAttr('value');
        $(this).removeAttr('checked');
    });
    return true
}