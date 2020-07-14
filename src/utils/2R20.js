const base = {
    "schema_version": 2,
    "oldId": "-M2EO3g9sXH6Q8lSFxpT",
    "name": "",
    "avatar": "",
    "bio": "",
    "gmnotes": "",
    "defaulttoken": "",
    "tags": "[]",
    "controlledby": "",
    "inplayerjournals": "",
    "attribs": [
        {
            name: "show_new_techniques",
            current: "1",
            max: "",
            id: generateUUID()
        },
        {
            name: "show_old_techniques",
            current: "0",
            max: "",
            id: generateUUID()
        },
        {
            "name": "point_summary_layout",
            "current": "2",
            "max": "",
            "id": generateUUID()
        }
    ],
    "abilities": []
}

export function exportR20(character) {
    const node = character.character;
    const profile = character.profile;
    const pointTotals = character.pointTotals;
    const native_language = node.evaluate("//advantage[./categories/category[contains(.,'Language')] and ./modifier[not(@enabled)]/name[contains(.,'Native')]] ", node, null, XPathResult.FIRST_ORDERED_NODE_TYPE)?.singleNodeValue;
    const static_fields = {
        strength_mod: character.ST.mod,
        strength_points: character.ST.pointsSpent(),
        dexterity_mod: character.DX.mod,
        dexterity_points: character.DX.pointsSpent(),
        intelligence_mod: character.IQ.mod,
        intelligence_points: character.IQ.pointsSpent(),
        health_mod: character.HT.mod,
        health_points: character.HT.pointsSpent(),
        perception_mod: character.Per.mod,
        perception_points: character.Per.pointsSpent(),
        willpower_mod: character.Will.mod,
        willpower_points: character.Will.pointsSpent(),
        basic_speed_mod: character.Speed.mod,
        basic_speed_points: character.Speed.pointsSpent(),
        basic_move_mod: character.Move.mod,
        basic_move_points: character.Move.pointsSpent(),
        hit_points_max_mod: character.HP.mod,
        hit_points_max_points: character.HP.pointsSpent(),
        fatigue_points_mod: character.FP.mod,
        fatigue_points_points: character.FP.pointsSpent(),

        name_native_language: native_language?.querySelector('name')?.textContent?.split(':')[1]?.slice(1) ?? "",
        native_language_spoken: 0,
        native_language_written: 0,

        tl: profile.TL,
        fullname: profile.name,
        race: profile.race,
        gender: profile.gender,
        size: profile.SM,
        hand: profile.handedness,
        birth_date: profile.birth_date,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        eyes: profile.eyes,
        hair: profile.hair,

        total_points: pointTotals.total,
        skills_points: pointTotals.skills,
    }
    var output = base;
    output.name = profile.name;
    output.avatar = 'data:image/png;base64,' + profile.portrait;
    output.attribs = output.attribs.concat(
        writeObjects(character.trait_list.iter().map(trait => trait.toR20())),
        writeObjects(character.skill_list.iter().map(skill => skill.toR20())),
        writeObjects(character.allItems().map(item => item.toR20())),
        writeObjects(static_fields, "single")
    )
    var json = JSON.stringify(output);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    return {
        download: `${profile.name}.json`,
        href: url,
    }
}

function writeObjects(objects, single) {
    //if you put in a list of things with a similar scheme
    if (!single) {
        console.log(objects);
        return [].concat.apply([], objects.map(object => {
            const row_id = object.row_id;
            var x = Object.entries(object.data).map(key => {
                return {
                    name: `${object.key}_${row_id}_${key[0]}`,
                    current: key[1] ? key[1] : "",
                    max: "",
                    id: generateUUID()
                }
            });
            //console.log(x);
            return x
        }))
    } else if (single === "single") {
        //if you put in a single object without a scheme
        var x = [].concat.apply([], Object.entries(objects).map(object => {
            const row_id = generateRowID();
            return {
                name: `${object[0]}`,
                current: object[1] ? object[1] : "",
                max: "",
                id: generateUUID()
            }
        }));
        //console.log(x);
        return x
    } else {
        console.log("nothing is happening");
    }
}

export function generateUUID() {
    var a = 0, b = [];
    return function () {
        var c = (new Date()).getTime() + 0, d = c === a;
        a = c;
        for (var e = new Array(8), f = 7; 0 <= f; f--) {
            e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
            c = Math.floor(c / 64);
        }
        c = e.join("");
        if (d) {
            for (f = 11; 0 <= f && 63 === b[f]; f--) {
                b[f] = 0;
            }
            b[f]++;
        } else {
            for (f = 0; 12 > f; f++) {
                b[f] = Math.floor(64 * Math.random());
            }
        }
        for (f = 0; 12 > f; f++) {
            c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
        }
        return c;
    }();
}

export function generateRowID() {
    return generateUUID().replace(/_/g, "Z");
}