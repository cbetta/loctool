/*
 * testTranslationSet.js - test the Translation Set object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!TranslationSet) {
    var TranslationSet = require("../lib/TranslationSet.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
}

module.exports = {
     testTranslationSetConstructor: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        test.ok(ts);
        test.done();
    },
    
    testTranslationSetRightSourceLocaleDefault: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        
        test.equal(ts.sourceLocale, "zxx-XX");
        test.done();
    },

    testTranslationSetGetEmpty: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        
        var r = ts.get("asdf");
        
        test.ok(!r);
        test.done();
    },
    
    testTranslationSetGet: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

    testTranslationIsDirtyNew: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        
        test.ok(!ts.isDirty());

        test.done();
    },

    testTranslationIsDirtyTrue: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        test.ok(ts.isDirty());
        
        test.done();
    },

    testTranslationIsDirtyFalse: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        ts.setClean();
        
        test.ok(!ts.isDirty());
        
        test.done();
    },

    testTranslationIsDirtyTrue2: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        ts.setClean();
        
        test.ok(!ts.isDirty());
        
        res = new ResourceString({
            key: "asdfasdfasdf",
            source: "This is another test"
        });

        ts.add(res);
        
        test.ok(ts.isDirty());
        
        test.done();
    },

    testTranslationIsDirtyAddSameResourceTwice: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        ts.setClean();
        
        test.ok(!ts.isDirty());
        
        // should not set the flag to dirty because the resource 
        // is already there, so nothing is added
        ts.add(res);
        
        test.ok(!ts.isDirty());
        
        test.done();
    },

    testTranslationSetGetWithContext: function(test) {
        test.expect(6);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            context: "different"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = ts.get("asdf", undefined, "different");

        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "different");
        
        test.done();
    },

    testTranslationSetGetDifferentTypesSameKeyIsOkay: function(test) {
        test.expect(6);

        var ts = new TranslationSet();
        var res = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "this too"]
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf", // same key
            source: "This is a test"
        });
        
        ts.add(res);
        
        // default type is string
        var r = ts.get("asdf");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.resType, "string");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.get("asdf", "array");

        test.equal(r.getKey(), "asdf");
        test.equal(r.resType, "array");
        test.deepEqual(r.getArray(), ["This is a test", "this too"]);
        
        test.done();
    },

    testTranslationSetGetUndefined: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var r = ts.get();
        
        test.ok(!r);
        test.done();
    },
    
    testTranslationSetGetFromMany: function(test) {
        test.expect(4);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "qwerty",
            source: "This is another test"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.get("qwerty");
        
        test.equal(r.getKey(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testTranslationSetGetBySource: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

    testTranslationSetGetBySourceNonAutoKey: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.ok(!r);

        test.done();
    },

    testTranslationSetGetBySourceFromMany: function(test) {
        test.expect(4);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "qwerty",
            autoKey: true,
            source: "This is another test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.getBySource("This is another test");
        
        test.equal(r.getKey(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testTranslationSetGetBySourceUndefined: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var r = ts.getBySource();
        
        test.ok(!r);
        test.done();
    },

    testTranslationSetGetBySourceWithContext: function(test) {
        test.expect(6);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
            // no context
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test",
            context: "foo"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = ts.getBySource("This is a test", "foo");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "foo");
        
        test.done();
    },

    testTranslationSetGetBySourceOnlyAutoKeys: function(test) {
        test.expect(6);

        var ts = new TranslationSet();
        var res = new ResourceString({
        	key: "r3423423",
        	autoKey: true,
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "explicit_id",
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getKey(), "r3423423");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.get("explicit_id");
        
        test.equal(r.getKey(), "explicit_id");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.get("r3423423");
        
        test.equal(r.getKey(), "r3423423");
        test.equal(r.getSource(), "This is a test");
        
        test.done();
    },

    testTranslationSetGetAll: function(test) {
        test.expect(6);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "qwerty",
            source: "This is another test"
        });
        
        ts.add(res);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        
        var r = resources[0];
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = resources[1];
        
        test.equal(r.getKey(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testTranslationSetGetAllEmpty: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var r = ts.getAll();
        test.ok(r);
        test.equal(r.length, 0);
        
        test.done();
    },
    
    testTranslationSetAddTranslationMerged: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            locale: "de-DE"
        });
        
        ts.add(res);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        test.done();
    },

    testTranslationSetAddTranslationDifferentContext: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            locale: "en-US"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            locale: "de-DE",
            context: "foo"
        });
        
        ts.add(res);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        test.done();
    },

    testTranslationSetAddAll: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);
        
        var r = ts.get("asdf");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

    testTranslationSetAddAllDifferentContexts: function(test) {
        test.expect(8);

        var ts = new TranslationSet();
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            context: "foo"
	        })
	    ]);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        
        var r = resources[0];
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = resources[1];
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "foo");
        test.done();
    },
    
    testTranslationSetSize: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        test.equal(ts.size(), 1);
        test.done();
    },

    testTranslationSetSizeMultiple: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            context: "different"
        });
        
        ts.add(res);
        
        test.equal(ts.size(), 2);
        
        test.done();
    },

    testTranslationSetEmpty: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        
        test.equal(ts.size(), 0);
        test.done();
    },

    testTranslationSetSizeMerged: function(test) {
        test.expect(3);

        var ts = new TranslationSet();
        
        test.equal(ts.size(), 0);
        
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        test.equal(ts.size(), 1);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            locale: "de-DE"
        });
        
        ts.add(res);
        
        test.equal(ts.size(), 2);

        test.done();
    },

    testTranslationSetSizeAddAll: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        
        test.equal(ts.size(), 0);
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);
        
        test.equal(ts.size(), 2);

        test.done();
    },
    
    testTranslationSetAddSet: function(test) {
        test.expect(2);

        var ts1 = new TranslationSet(),
        	ts2 = new TranslationSet();
        
        ts1.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);

        ts2.addAll([
	        new ResourceString({
	            key: "foobar",
	            source: "This is yet another test"
	        }),
	        new ResourceString({
	            key: "blahblah",
	            source: "One of its feet is both the same."
	        })
	    ]);

        test.equal(ts1.size(), 2);
        
        ts1.addSet(ts2);
        
        test.equal(ts1.size(), 4);

        test.done();
    },
    
    testTranslationSetAddSetRightContents: function(test) {
        test.expect(10);

        var ts1 = new TranslationSet(),
        	ts2 = new TranslationSet();
        
        ts1.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);

        ts2.addAll([
	        new ResourceString({
	            key: "foobar",
	            source: "This is yet another test"
	        }),
	        new ResourceString({
	            key: "blahblah",
	            source: "One of its feet is both the same."
	        })
	    ]);

        ts1.addSet(ts2);
        
        var r = ts1.getAll();
        
        test.ok(r);
        test.equal(r.length, 4);
        
        test.equal(r[0].reskey, "asdf");
        test.equal(r[0].text, "This is a test");
        
        test.equal(r[1].reskey, "qwerty");
        test.equal(r[1].text, "This is another test");
        
        test.equal(r[2].reskey, "foobar");
        test.equal(r[2].text, "This is yet another test");
        
        test.equal(r[3].reskey, "blahblah");
        test.equal(r[3].text, "One of its feet is both the same.");
        
        test.done();
    },

    testTranslationSetAddSetMerge: function(test) {
        test.expect(2);

        var ts1 = new TranslationSet(),
        	ts2 = new TranslationSet();
        
        ts1.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);

        ts2.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "blahblah",
	            source: "One of its feet is both the same."
	        })
	    ]);

        test.equal(ts1.size(), 2);
        
        ts1.addSet(ts2);
        
        test.equal(ts1.size(), 3);

        test.done();
    },
    
    testTranslationSetAddSetMergeRightContents: function(test) {
        test.expect(8);

        var ts1 = new TranslationSet(),
        	ts2 = new TranslationSet();
        
        ts1.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);

        ts2.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "blahblah",
	            source: "One of its feet is both the same."
	        })
	    ]);

        ts1.addSet(ts2);
        
        var r = ts1.getAll();
        
        test.ok(r);
        test.equal(r.length, 3);
        
        test.equal(r[0].reskey, "asdf");
        test.equal(r[0].text, "This is a test");
        
        test.equal(r[1].reskey, "qwerty");
        test.equal(r[1].text, "This is another test");
        
        test.equal(r[2].reskey, "blahblah");
        test.equal(r[2].text, "One of its feet is both the same.");
        
        test.done();
    },

    testTranslationSetAddSetEmpty: function(test) {
        test.expect(2);

        var ts1 = new TranslationSet(),
        	ts2 = new TranslationSet();
        
        ts1.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);

        test.equal(ts1.size(), 2);
        
        ts1.addSet(ts2);
        
        test.equal(ts1.size(), 2);

        test.done();
    },
    
    testTranslationSetAddSetEmptyRightContents: function(test) {
        test.expect(6);

        var ts1 = new TranslationSet(),
        	ts2 = new TranslationSet();
        
        ts1.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);

        ts1.addSet(ts2);
        
        var r = ts1.getAll();
        
        test.ok(r);
        test.equal(r.length, 2);
        
        test.equal(r[0].reskey, "asdf");
        test.equal(r[0].text, "This is a test");
        
        test.equal(r[1].reskey, "qwerty");
        test.equal(r[1].text, "This is another test");
        
        test.done();
    },

    testTranslationSetAddSetUndefined: function(test) {
        test.expect(2);

        var ts1 = new TranslationSet();
        
        ts1.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);

        test.equal(ts1.size(), 2);
        
        ts1.addSet(undefined);
        
        test.equal(ts1.size(), 2);

        test.done();
    },
    
    testTranslationSetAddSetUndefinedRightContents: function(test) {
        test.expect(6);

        var ts1 = new TranslationSet();
        
        ts1.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);

        ts1.addSet(undefined);
        
        var r = ts1.getAll();
        
        test.ok(r);
        test.equal(r.length, 2);
        
        test.equal(r[0].reskey, "asdf");
        test.equal(r[0].text, "This is a test");
        
        test.equal(r[1].reskey, "qwerty");
        test.equal(r[1].text, "This is another test");
        
        test.done();
    },
    
    testTranslationSetGetBySingleField: function(test) {
        test.expect(6);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            context: "bar",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        var r = ts.getBy({
        	project: "yowza"
        });
        
        test.ok(r);
        test.equal(r.length, 2);
        
        test.equal(r[0].reskey, "llashdfoi");
        test.equal(r[0].text, "blah blah blah");
        
        test.equal(r[1].reskey, "ajajsdjdsj");
        test.equal(r[1].text, "blah blah blah en espanol");
        
        test.done();
    },

    testTranslationSetGetByDoubleFields: function(test) {
        test.expect(17);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "pt-BR"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            context: "bar",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        var r = ts.getBy({
        	project: "foo",
        	locale: "de-DE"
        });
        
        test.ok(r);
        test.equal(r.length, 3);
        
        test.equal(r[0].reskey, "asdf");
        test.equal(r[0].text, "This is a test");
        test.equal(r[0].getProject(), "foo");
        test.equal(r[0].getLocale(), "de-DE");
        test.equal(r[0].getContext(), "bar");

        test.equal(r[1].reskey, "qwerty");
        test.equal(r[1].text, "This is another test");
        test.equal(r[1].getProject(), "foo");
        test.equal(r[1].getLocale(), "de-DE");
        test.equal(r[1].getContext(), "bar");

        test.equal(r[2].reskey, "qwerty");
        test.equal(r[2].text, "This is another test");
        test.equal(r[2].getProject(), "foo");
        test.equal(r[2].getLocale(), "de-DE");
        test.ok(!r[2].getContext());
     
        test.done();
    },

    testTranslationSetGetByDoubleFields: function(test) {
        test.expect(17);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "pt-BR"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            context: "bar",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        var r = ts.getBy({
        	project: "foo",
        	locale: "de-DE"
        });
        
        test.ok(r);
        test.equal(r.length, 3);
        
        test.equal(r[0].reskey, "asdf");
        test.equal(r[0].text, "This is a test");
        test.equal(r[0].getProject(), "foo");
        test.equal(r[0].getLocale(), "de-DE");
        test.equal(r[0].getContext(), "bar");

        test.equal(r[1].reskey, "qwerty");
        test.equal(r[1].text, "This is another test");
        test.equal(r[1].getProject(), "foo");
        test.equal(r[1].getLocale(), "de-DE");
        test.equal(r[1].getContext(), "bar");

        test.equal(r[2].reskey, "qwerty");
        test.equal(r[2].text, "This is another test");
        test.equal(r[2].getProject(), "foo");
        test.equal(r[2].getLocale(), "de-DE");
        test.ok(!r[2].getContext());
     
        test.done();
    },

    testTranslationSetGetProjects: function(test) {
        test.expect(5);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "pt-BR"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            context: "bar",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        var projects = ts.getProjects();
        
        test.ok(projects);
        test.equal(projects.length, 3);
        
        test.equal(projects[0], "foo");
        test.equal(projects[1], "asdf");
        test.equal(projects[2], "yowza");
     
        test.done();
    },

    testTranslationSetGetProjectsEmpty: function(test) {
        test.expect(1);

        var ts = new TranslationSet()
        
        var projects = ts.getProjects();
        
        test.ok(!projects);
        
        test.done();
    },

    testTranslationSetGetContexts: function(test) {
        test.expect(4);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "pt-BR"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            context: "bar",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        var contexts = ts.getContexts("foo");
        
        test.ok(contexts);
        test.equal(contexts.length, 2);
        
        test.equal(contexts[0], "bar");
        test.equal(contexts[1], "");
     
        test.done();
    },

    testTranslationSetGetContextsEmpty: function(test) {
        test.expect(1);

        var ts = new TranslationSet()

        var contexts = ts.getContexts("foo");
        
        test.ok(!contexts);

        test.done();
    },

    testTranslationSetGetContextsOnlyRoot: function(test) {
        test.expect(3);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "pt-BR"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        var contexts = ts.getContexts("yowza");
        
        test.ok(contexts);
        test.equal(contexts.length, 1);
        
        test.equal(contexts[0], "");
     
        test.done();
    },

    testTranslationSetGetLocales: function(test) {
        test.expect(5);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "pt-BR"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            context: "bar",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        var locales = ts.getLocales("foo", "bar");
        
        test.ok(locales);
        test.equal(locales.length, 3);
        
        test.equal(locales[0], "de-DE");
        test.equal(locales[1], "fr-FR");
        test.equal(locales[2], "nl-NL");
     
        test.done();
    },

    testTranslationSetGetLocalesEmpty: function(test) {
        test.expect(1);

        var ts = new TranslationSet()
        
        var locales = ts.getLocales("foo", "bar");
        
        test.ok(!locales);
     
        test.done();
    },

    testTranslationSetClear: function(test) {
        test.expect(2);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "pt-BR"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            context: "bar",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        test.equal(ts.size(), 10);
        
        ts.clear();
        
        test.equal(ts.size(), 0);

        test.done();
    },

    testTranslationSetClearReallyGone: function(test) {
        test.expect(4);

        var ts = new TranslationSet()
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            context: "bar",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "ooo la la",
	            project: "foo",
	            context: "bar",
	            locale: "fr-FR"
	        }),	        
	        new ResourceString({
	            key: "qwerty",
	            source: "gossie",
	            project: "foo",
	            context: "bar",
	            locale: "nl-NL"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test",
	            project: "foo",
	            locale: "de-DE"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is yet another test",
	            project: "foo",
	            locale: "pt-BR"
	        }),
	        new ResourceString({
	            source: "test test blah",
	            key: "foobarfoo",
	            project: "asdf",
	            context: "bar",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "test test d blah",
	            key: "foobarfoo",
	            project: "asdf",
	            locale: "ja-JP"
	        }),
	        new ResourceString({
	            source: "blah blah blah",
	            key: "llashdfoi",
	            project: "yowza",
	            context: "bar",
	            locale: "en-US"
	        }),
	        new ResourceString({
	            source: "blah blah blah en espanol",
	            key: "ajajsdjdsj",
	            project: "yowza",
	            locale: "es-ES"
	        })
	    ]);

        var resources = ts.getBy({project: "yowza"})
        
        test.ok(resources);
        test.equal(resources.length, 2);
        
        ts.clear();
        
        resources = ts.getBy({project: "yowza"})
        
        test.ok(resources);
        test.equal(resources.length, 0);
        
        test.done();
    }
};
