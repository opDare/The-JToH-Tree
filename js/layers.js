addLayer("s", {
    name: "Skill", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Skills", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        //S up
        if (hasUpgrade('s', 13)) mult = mult.times(upgradeEffect('s', 13));
        if (hasUpgrade('s', 15)) mult = mult.times(upgradeEffect('s', 15));
        if (hasUpgrade('s', 22)) mult = mult.times(upgradeEffect('s', 22));
        if (hasUpgrade('s', 23)) mult = mult.times(2);
        if (hasUpgrade('s', 31)) mult = mult.times(1.05);
        if (hasUpgrade('s', 34)) mult = mult.times(2);
        if (hasUpgrade('s', 41)) mult = mult.times(2);
        if (hasUpgrade('s', 42)) mult = mult.times(1.1);
        if (hasUpgrade('s', 43)) mult = mult.times(1.1);
        if (hasUpgrade('s', 51)) mult = mult.times(2);
        if (hasUpgrade('s', 53)) mult = mult.times(upgradeEffect('s', 53));
        if (hasUpgrade('s', 54)) mult = mult.times(3);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Skills", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: [
        "main-display",
        ["display-text", function() { return "Your skills has boost of ×<em>"+format(tmp[this.layer].gainMult)+"</em>"}],
        "prestige-button",
        "clickables",
        "blank",
        "upgrades"
    ],
    passiveGeneration() {
        return hasMilestone('g', 0) ? 0.01 : 0
    },
    clickables: {
        11: {
            title: "Hold to reset",
            display: "(Mobile QoL)",
            onClick() {if(canReset(this.layer)) doReset(this.layer)},
            onHold() {if(canReset(this.layer)) doReset(this.layer)},
            canClick() {return true},
        },
    },
    upgrades: {
        11: {
            title: "#S1: Beat ToAST | #1",
            description: "You beat your first tower in JToH, double your point gain",
            cost: new Decimal(1),
        },
        12: {
            title: "#S2: Beat ToA | #2",
            description() {
                let desc = "You beat your second tower. Increase your point gain base on skills";
                if (hasUpgrade('c', 13)) desc = "You beat your second tower. Increase your points and clicks gain base on skills"
                return desc
            },
            tooltip: "(Skills+1)^0.2",
            cost: new Decimal(2),
            unlocked() {
                return hasUpgrade('s', 11)
            },
            effect() {
                let eff = player[this.layer].points.add(1).pow(0.2)
                if (hasAchievement('a', 13)) eff = eff.pow(1.125)
                return eff
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }

        },
        13: {
            title: "#S3: Beat ToM | #3",
            description: "You beat your first medium tower. Increase your skill gain base on points",
            tooltip: "(Points+1)^0.15",
            cost: new Decimal(5),
            unlocked() {
                return hasUpgrade('s', 12)
            },
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }
        },
        14: {
            title: "#S4: Watching a guide | #4",
            description: "You are trying to beat your new hardest tower with some help, 1.5x points gain",
            cost: new Decimal(15),
            unlocked() {
                return hasUpgrade('s', 13)
            }
        },
        15: {
            title: "#SE1: Found and beat NEaT | #5",
            description() {
                let desc = "Secret(SE) Upgrade! You can find it with weird requirement <br> x1~1.2 skills randomly every tick";
                if (!hasUpgrade('s', 15) && hasUpgrade('s', 44)) desc = "Are you blind, buy me now or you won't get any access to all SE upgrades <br> AH↓HA↑HA↑HA↑HA<br>↑PE↗KO↘PE↗KO↘PE↗KO↘";
                return desc
            },
            tooltip() {if (hasUpgrade('c', 25)) 
                    {return "Requirement: Skills%10=7 <br> (1+0.2*(points%100/100))*1.1"}
                else {return "Requirement: Skills%10=7 <br> 1+0.2*(points%100/100)"}},
            //"Requirement: Skills%10=7 <br> 1+0.2*(points%100/100)"
            cost() {return (6.9420**1.87)},
            unlocked() {
                return (hasUpgrade('s',14) && (player.s.points % 10 == 7)) || hasUpgrade('s', 15) || hasUpgrade('s', 44)
            },
            effect() {
                let eff =(1+(0.2*(player.points%100/100)));
                if (hasUpgrade('c', 25)) {eff = eff*1.1};
                return eff
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }
        },
        21: {
            title: "#S5: Grind ToK | #6",
            description: "You start grinding your first hard tower, double point gain but tenfold increase the cost of <b>ALL</b> ToH upgrades",
            cost() {
                if (hasUpgrade('s', 23)){return 250} else {return 25} 
            },
            unlocked() {
                if (!hasUpgrade('s', 23)) 
                    {if (hasUpgrade('s', 14)) {return true} else {return false}} 
                    else if (hasUpgrade('s', 23) && (hasUpgrade('s', 34) || hasUpgrade('s', 32)))
                        {return true}
                        else {return false}
            }
        },
        22: {
            title: "#S6: Forgetful | #7",
            description: "You forgot to heal in killbrick walking section, see how dumb was you. <br> boost skill base on skills",
            tooltip: "(Skills+1)^0.15",
            cost() {
                if (hasUpgrade('s', 23)){return 500} else {return 50} 
            },
            unlocked() {
                if (!hasUpgrade('s', 23)) 
                    {if (hasUpgrade('s', 21)) {return true} else {return false}} 
                    else if (hasUpgrade('s', 23) && (hasUpgrade('s', 34) || hasUpgrade('s', 32)))
                        {return true}
                        else {return false}
            },
            effect() {
                return player[this.layer].points.add(1).pow(0.15)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }
        },
        23: {
            title: "#S9: Grind ToH | #10",
            description: "You start grinding your first hard tower, double skill gain but tenfold increase the cost of <b>ALL</b> ToK upgrade",
            cost() {
                if (hasUpgrade('s', 21)){return 250} else {return 25} 
            },
            unlocked() {
                if (!hasUpgrade('s', 21)) 
                    {if (hasUpgrade('s', 14)) {return true} else {return false}} 
                    else if (hasUpgrade('s', 21) && (hasUpgrade('s', 34) || hasUpgrade('s', 32)))
                        {return true}
                        else {return false}
            }
        },
        24: {
            title: "#S10: Overestimate | #11",
            description: "You thought you can skip 6 outside with 8 studs warp. Boost points base on points",
            tooltip: "((Points+1)^0.1)^2",
            cost(){
                if (hasUpgrade('s', 21)){return 500} else {return 50}
            },
            unlocked() {
                if (!hasUpgrade('s', 21)) 
                    {if (hasUpgrade('s', 23)) {return true} else {return false}} 
                    else if (hasUpgrade('s', 21) && (hasUpgrade('s', 34) || hasUpgrade('s', 32)))
                        {return true}
                        else {return false}
            },
            effect() {
                return (player.points.add(1).pow(0.1)).pow(2)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }
        },
        31: {
            title: "#S7: Cannot push | #8",
            description: "Rage quit in pushing block section becuase you stuck 20 minutes there. x1.05 Skill",
            cost() {
                if (hasUpgrade('s', 23)){return 2000} else {return 200}
            },
            unlocked() {
                if (!hasUpgrade('s', 23)) 
                    {if (hasUpgrade('s', 22)) {return true} else {return false}} 
                    else if (hasUpgrade('s', 23) && (hasUpgrade('s', 34) || hasUpgrade('s', 32)))
                        {return true}
                        else {return false}
            }
        },
        32: {
            title: "#S8: Beat ToK | #9",
            description: "Fun. Double point gain",
            cost() {
                if (hasUpgrade('s', 23)){return 3000} else {return 300}
            },
            unlocked() {
                if (!hasUpgrade('s', 23)) 
                    {if (hasUpgrade('s', 31)) {return true} else {return false}} 
                    else if (hasUpgrade('s', 23) && (hasUpgrade('s', 34) || hasUpgrade('s', 32)))
                        {return true}
                        else {return false}
            }
        },
        33: {
            title: "#S11: Broken winpad | #12",
            description: "F. x1.2 points",
            cost(){
                if (hasUpgrade('s', 21)){return 2000} else {return 200}
            },
            unlocked() {
                if (!hasUpgrade('s', 21)) 
                    {if (hasUpgrade('s', 24)) {return true} else {return false}} 
                    else if (hasUpgrade('s', 21) && (hasUpgrade('s', 34) || hasUpgrade('s', 32)))
                        {return true}
                        else {return false}
            }
        },
        34: {
            title: "#S12: Beat ToH | #13",
            description: "Hecc. Double skill gain",
            cost() {
                if (hasUpgrade('s', 21)){return 3000} else {return 300}
            },
            unlocked() {
                if (!hasUpgrade('s', 21)) 
                    {if (hasUpgrade('s', 33)) {return true} else {return false}} 
                    else if (hasUpgrade('s', 21) && (hasUpgrade('s', 34) || hasUpgrade('s', 32)))
                        {return true}
                        else {return false}
            }
        },
        41: {
            title: "#S13: Find Forgotten Ridge | #14",
            description: "Tram travel~~~~ <br> Unlock new layer and double point and skill gain",
            cost: new Decimal(700),
            unlocked() {
                return hasUpgrade('s',32) || hasUpgrade('s', 34)
            }
        },
        42: {
            title: "SE2: Secret UP: Found and beat SoFM | #19",
            description: "how this tower allowed in game. x1.1 clicks and skills gain",
            cost: new Decimal(10000),
            tooltip: "Unlock requirement: click <= 2",
            unlocked() {
                if (!hasUpgrade('c', 14) && !hasUpgrade('s', 15)) 
                {return false} 
                else if ((player.c.points <= 2)||(hasUpgrade('s', 42))) 
                {return true}
            }
        },
        43: {
            title: "S14: Go to Ring 2 | #20",
            description: "Finally go to ring 2. x1.2 skills gain",
            cost: new Decimal(50000),
            unlocked() {
                return hasUpgrade('c', 14)
            }
        },
        44: {
            title: "S19: Go to Garden of Eeshöl | #31",
            description: "Another subrealm, another layer. not done yet",
            cost: new Decimal(1e10),
            unlocked() {
                return hasUpgrade('s', 43)
            }
        },
        51: {
            title: "S15: Beat ToPS | #21",
            description: "You realised that this tower is fun. x1.1 Clicks and x2 Skills",
            cost: new Decimal(75000),
            unlocked() {
                return hasUpgrade('s', 43)
            }
        },
        52: {
            title: "S16: Beat ToBH | #22",
            description: "sɹǝʎɐן ƃuıuuıɥʇ ɟo ɹǝʍoʇ <br> Boost points gain by click",
            tooltip: "log<sub>5</sub>(5+clicks)^0.5",
            cost: new Decimal(800000),
            unlocked() {
                return hasUpgrade('s', 43)
            },
            effect() {
                return ((Math.log(5+player.c.points)/Math.log(5))**0.5)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }
        },
        53: {
            title: "S17: Beat ToOH | #26",
            description: "The start of It_Near's towers. log(Skills) boost to skills",
            tooltip: "log<sub>10</sub>(1+Skills)",
            cost: new Decimal(10000000),
            unlocked() {
                return hasUpgrade('c', 23)
            },
            effect() {
                return (Math.log10(1+player.s.points))
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }
        },
        54: {
            title: "S18: Beat SoLW | #30",
            description: "Not pain as all. Triple all stats in row 1",
            cost: new Decimal(250000000),
            unlocked() {
                return hasUpgrade('s', 53)
            }
        }
    }
}),
addLayer("c", {
    name: "Clicker",
    symbol: "C",
    position: 1,
    startData() { return {
        unlocked() {
            return player.s.best.gte(1000) && hasUpgrade('s', 41)
        },
        points: new Decimal(0),
    }},
    color: "#EEEEEE",
    resource: "Clicks",
    type: "none",
    branches: ["s"],
    exponent: 0.5,
    gainMult() {
        gain2 = new Decimal(1);
        //Skills Upgrades
        if (hasUpgrade('s', 42)) gain2 = gain2.times(1.1);
        if (hasUpgrade('s', 54)) gain2 = gain2.times(3);

        //Clicks Upgrades
        if (hasUpgrade('c', 11)) gain2 = gain2.times(2);
        if (hasUpgrade('c', 12)) gain2 = gain2.times(2);
        if (hasUpgrade('c', 13)) gain2 = gain2.times(upgradeEffect('s', 12));
        if (hasUpgrade('c', 21)) gain2 = gain2.times(3);
        if (hasUpgrade('c', 22)) gain2 = gain2.times(2);
        if (hasUpgrade('c', 24)) gain2 = gain2.times(2);

        //G ups
        if (hasUpgrade('g', 12)) gain2 = gain2.times(10);

        return gain2
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        {key: "c", description: "C: Click", 
        onClick() {
            player.c.points = player.c.points.plus(gain2)
        }}
    ],
    layerShown() { return hasUpgrade('s', 41)},
    tabFormat: [
        "main-display",
        ["display-text", function() { return "Your clicks has boost of ×<em>"+format(tmp[this.layer].gainMult)+"</em>"}],
        "prestige-button",
        "blank",
        "clickables",
        "blank",
        "upgrades"
    ],
    clickables: {
        11: {
            title: "Click",
            display() { return "Click to gain clicks" },
            canClick() {return true},
            onClick() {
                gain2 = tmp[this.layer].gainMult;
                player.c.points = player.c.points.plus(gain2)
            }
        },
        12: {
            title: "Reset click to 0",
            display: "To fix clicks",
            canClick() {return true},
            onClick() {
                if (confirm("Are you sure you want to do this? You will lose clicks!") == true) 
                {
                    player.c.points = 0;
                    save(true);
                    window.location.reload();
                } 
                
            }
        }
    },
    upgrades: {
        11: {
            title: "#C1: Double click | #15",
            description: "Bau Bau",
            cost: new Decimal(50)
        },
        12: {
            title: "#C2: Beat SoMD | #16",
            description: "First steeple... x1.5 points and double clicks",
            cost: new Decimal(150),
            unlocked() {
                return hasUpgrade('c', 11)
            }
        },
        //Old 13 ups, removed due to dumb mistake
        /*13: {
            title: "#C3: Beat ToJGF | #17",
            description: "Hard for new players. click boost base on digit of clicks",
            tooltip: "floor(log10(Clicks+1)",
            cost: new Decimal(300),
            unlocked() {
                return hasUpgrade('c',11)
            },
            effect() {
                return Math.floor(Math.log10(player[this.layer].points.add(1)))
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }

        },*/
        13: {
            title: "#C3: Beat ToJGF | #17",
            description: "Hard for new players. S2(#2) also boost clicks now",
            cost: new Decimal(300),
            unlocked() {
                return hasUpgrade('c', 11)
            }
        },
        14: {
            title: "#C4: Exploring FR | #18",
            description: "You find ToMB and unlocked some upgrades in Skills",
            cost: new Decimal(1500),
            unlocked() {
                return hasUpgrade('c', 12) || hasUpgrade('c', 13)
            }
        },
        15: {
            title: "#C9: CHallenge is fun | #29",
            description: "x2.2 Boost Difficult challenge point <br>",
            tooltip: "Useful later",
            cost: new Decimal(100000000),
            unlocked() {
                return hasUpgrade('c', 24) 
            }

        },
        21: {
            title: "#C5: Walking outside of R2 lobby | #23",
            description: "Wasted time, x3 click",
            cost: new Decimal(5000),
            unlocked() {
                return hasUpgrade('s',51)
            }
        },
        22: {
            title: "#C6: Beat SoP | #24",
            description: "nerfed CoP. click gain double",
            cost: new Decimal(12500),
            unlocked() {
                return hasUpgrade('c', 21)
            }
        },
        23: {
            title: "#C7: Having fun in ToOH | #25",
            description: "yea healing is fun definitely. Change the exponent of hard badge boost to 0.5",
            cost: new Decimal(30000),
            unlocked() {
                return hasUpgrade('c', 22)
            }
        },
        24: {
            title: "#C8: Learning ABC| #28",
            description: "I have no idea. Double clicks",
            tooltip: "<i>Eigo wa mazukashii <br>-Omaru Polka</i>",
            cost: new Decimal(50000),
            unlocked() {
                return hasUpgrade('s', 53)
            }
        },
        25: {
            title: "SE3: Beat MAT| #27",
            description: "x1.1 SE1 boost",
            tooltip: "Requirement: Skills >= 100,000,000 and Clicks <= Click boost*10",
            cost() {
                if (player.s.points >= 1e8 && player.c.points <= (gain2*10)) {return new Decimal(69.420)} 
                else {return new Decimal(Infinity)}
            },
            unlocked() {
                return hasUpgrade('s', 53) && player.s.points >= 1e8 && player.c.points <= (gain2*10) && hasUpgrade('s', 15) || hasUpgrade('c', 25)
            }
        }
    }

}),
addLayer("g", {
    //This layer is not done, planned to be challenge layer
    name: "Grinding",
    symbol: "G",
    position: 0,
    startData() { return {
        unlocked() {
            return hasUpgrade('s', 44)
        },
        points: new Decimal(0),
        total: new Decimal(0)

    }},
    color: "#3422FF",
    resource: "Grind Points",
    type: "none",
    branches: ["s","c"],
    exponent: 0.5,
    gainMult() {
        gain = new Decimal(0);
        //add GP
        if (hasChallenge('g', 11)) gain = gain.add(1);
        if (hasChallenge('g', 12)) gain = gain.add(1);
        totalg = gain;
        //decrease GP
        if (hasUpgrade('g', 12)) gain = gain.add(-1);
        if (hasUpgrade('g', 13)) gain = gain.add(-1);
        player.g.points = gain;
        return player.g.points
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    layerShown() {return hasUpgrade('s', 44)},
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                ["display-text", function() {return "You have total "+format(totalg)+" Gain Points"}],
                ["display-text", function() { if (hasUpgrade('g', 11)) {return "You have total "+format(Math.floor(player.timese3.points))+" times for SE4"}}],
                "blank",
                "milestones",
                "blank",
                "upgrades"
            ]
        },
        "Challenge": {
            content: [
                "main-display",
                ["display-text", function() {return "You have total "+format(totalg)+" Gain Points"}],
                "challenges",
            ]
        },
        "Challenge Board": {
            embedLayer() {if (inChallenge('g', 11)) {return "toky"}
                            else if (inChallenge('g', 12)) {return "toch"}
                            else {return "gno"}}
        }
    },
    upgrades: {
        11: {
            title: "SE4: afk 20 minutes in ToKY | #32",
            description: "start getting time every second which can boost points and CP gain",
            tooltip: "Requirement: CP >= (CP boost)*1000<br>1+(log<sub>5</sub>(time<sup>0.035</sup>)",
            cost: new Decimal(0),
            effect() {
                return (1+((Math.log(player.timese3.points**0.035))/Math.log(5)))
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
            unlocked() {
                return (inChallenge('g', 11) && player.toky.points >= tmp.toky.gainMult*1000 && tmp.toky.gainMult != 1) && hasUpgrade('s', 15) || hasUpgrade('g', 11)
            }

        },
        12: {
            title: "G1: Be prond of beat first difficult tower | #33",
            description: "tenfold skills gain",
            cost: new Decimal(1)
        },
        13: {
            title: "G2: Win a tower | #34",
            description: "tenfold clicks gain<br>(Endgame)",
            cost: new Decimal(1),
            unlocked() {
                return hasUpgrade('g', 12)
            }
        }
    },
    milestones: {
        0: {
            requirementDescription: "First Challenge done",
            effectDescription: "Get 1% of Skills gain every second",
            done() {
                return hasChallenge('g', 11)
            }
        }
    },
    challenges: {
        11: {
            name: "Beat ToKY",
            ChallengeDescription: "This is your first challenge to difficult.",
            canComplete() {return player.toky.points >= 1000000},
            goalDescription: "1,000,000 Challenge Points (CP)",
            rewardDescription: "Get 1 Gain Point (GP)"
        },
        12: {
            name: "Beat ToCH",
            ChallengeDescription: "tsumetaite",
            canComplete() {return player.toch.points >= 1000},
            goalDescription: "1000 CP",
            rewardDescription: "Get 1 GP",
            unlocked() {
                return hasChallenge('g', 11)
            }
        }
    }

}),
addLayer("a", {
    startData() {
        return {
            unlocked: true,

        }
    },
    color: "yellow",
    row: "side",
    exponent: 0.3,
    layerShown() { return true },
    tooltip() {
        return ("Achievements")
    },
    gainMult() {
        mult = new Decimal(0);
        if (hasAchievement('a', 11)) mult = mult.plus(1);
        if (hasAchievement('a', 12)) mult = mult.plus(1);
        if (hasAchievement('a', 13)) mult = mult.plus(1);
        if (hasAchievement('a', 14)) mult = mult.plus(1);
        if (hasAchievement('a', 15)) mult = mult.plus(1);
        if (hasAchievement('a', 21)) mult = mult.plus(1);
        if (hasAchievement('a', 91)) mult = mult.plus(1);
        if (hasAchievement('a', 92)) mult = mult.plus(1);
        if (hasAchievement('a', 93)) mult = mult.plus(1);
        if (hasAchievement('a', 94)) mult = mult.plus(1);

        player.a.points = mult;
        return player.a.points
    },
    achievements: {
        rows: 20,
        columns: 5,
        11: {
            name: "First win",
            tooltip: "Beat any tower",
            done() {
                return hasUpgrade('s', 11) || hasUpgrade('s', 12) || hasUpgrade('s', 13)
            }
        },
        12: {
            name: "Classic Subrealm",
            tooltip: "KToH Ring 1",
            done() {
                return hasUpgrade('s', 41)
            }
        },
        13: {
            name: "First Steeple",
            tooltip: "500 studs shorter. <br> Reward: ^1.125 to Beat ToA boost ",
            done() {
                return hasUpgrade('c', 12)
            }
        },
        14: {
            name: "10 towers beaten",
            tooltip: "Start of the beginning. ",
            done() {
                return hasUpgrade('c', 22) || hasUpgrade("s", 52)
            }
        },
        15: {
            name: "Close to Nature",
            tooltip: "Beginner friendly",
            done() {
                return hasUpgrade('s', 44)
            }
        },
        91: {
            name: "Easy",
            tooltip: "Get any upgrade which is easy tower. <br> Reward: Boost point by (i<sup>2</sup>+2)*tan(45\u00B0)",
            done() {
                return hasUpgrade('s', 11) || hasUpgrade('s', 12)
            }
        },
        92: {
            name: "Medium",
            tooltip: "Harder than ToOD <br> Reward: Point boost itself by short amount <br> 1+(Points^0.01)",
            done() {
                return hasUpgrade('s', 13)
            },
        },
        93: {
            name: "Hard",
            tooltip() {if (hasUpgrade('c', 23)) 
                    {return "Not even hard <br> Reward: Achievements amount boost point gain <br> Achievements^0.5"}
                else {return "Not even hard <br> Reward: Achievements amount boost point gain <br> Achievements^0.125"}},
            done() {
                return hasUpgrade('s', 32) || hasUpgrade('s', 34)
            }
            
        },
        94: {
            name: "Difficult",
            tooltip: "Very Hard. Total GP boost CP <br> (2+GP*i<sup>4</sup>(sin<sup>2</sup>GP\u00B0+cos<sup>2</sup>GP\u00B0)*πe<sup>0<sub><br>log<sub>69</sub>(69))*In(e<sup>0.5</sup>)",
            done() {
                return hasChallenge('g', 11) || hasChallenge('g', 12)
            }
        }
    }
})
addLayer("dev", {
    startData() {
        return {
            unlocked: true
        }
    },
    color: "white",
    row: "side",
    layerShown() { return true },
    tooltip() {
        return ("Dev Test Buttons")
    },
    //lol dev buttons for testing, ignore it if you want to beat it legit
    tabFormat: {
        /*"Main": {
            content: [
                ["display-text", function() { return "<h1>This layer is for creator to debug, you shouldn't be here.</h1>"}],
                ["display-text", function() { return "<h1>Your progress will be marked to be not legit forever.</h1>"}],
                ["display-text", function() { return "<h1>Are you sure you have to cheat?</h1>"}],
                ["clickables", [99]]
            ]
        },*/
        "Point add": {
            content: [
                ["clickables", [1,2,3,4,5]]
            ]
        },
        "Savebank": {
            content: [
                ["clickables", [6]]
            ]
        },
        "Tickspeed": {
            content: [
                ["clickables", [50]]
            ]
        },
        "CheckTime": {
            embedLayer: "timese3"
        }
    },
    clickables: {
        11: {
            title: "save refresh",
            canClick() {return true},
            onClick() {
                save(true);
                window.location.reload();
            }
        },
        21:{
            title: "reset points",
            canClick() {return true},
            onClick() {
                player.points = 0
            }
        },
        22: {
            title: "100 points",
            canClick() {return true},
            onClick() {
                player.points = player.points.plus(100)
            }
        },
        23: {
            title: "1M points",
            canClick() {return true},
            onClick() {
                player.points = player.points.plus(1e6)
            }
        },
        31:{
            title: "reset skills",
            canClick() {return true},
            onClick() {
                player.s.points = 0
            }
        },
        32: {
            title: "100 skills",
            canClick() {return true},
            onClick() {
                player.s.points = player.s.points.plus(100)
            }
        },
        33: {
            title: "10K skills",
            canClick() {return true},
            onClick() {
                player.s.points = player.s.points.plus(10000)
            }
        },
        34: {
            title: "1M skills",
            canClick() {return true},
            onClick() {
                player.s.points = player.s.points.plus(1000000)
            }
        },
        35: {
            title: "1e10 skills",
            canClick() {return true},
            onClick() {
                player.s.points = player.s.points.plus(1e10)
            }
        },
        41:{
            title: "reset clicks",
            canClick() {return true},
            onClick() {
                player.c.points = 0;
            }
        },
        42: {
            title: "100 Clicks",
            canClick() {return true},
            onClick() {
                player.c.points = player.c.points.plus(100)
            }
        },
        43: {
            title: "10K Clicks",
            canClick() {return true},
            onClick() {
                player.c.points = player.c.points.plus(10000)
            }
        },
        44: {
            title: "1M Clicks",
            canClick() {return true},
            onClick() {
                player.c.points = player.c.points.plus(1000000)
            }
        },
        51: {
            title: "1 GP",
            canClick() {return true},
            onClick() {
                player.g.points = player.g.points.plus(1)
            }
        },
        61: {
            title: "G layer start",
            canClick() {return true},
            onClick() {
                if(!confirm("Your current progress will not be saved!")) return;
            importSave("eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTcwNTUwNTg1OTI3Niwibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJUSlQiLCJ2ZXJzaW9uIjoiMC4wIiwidGltZVBsYXllZCI6MTI2Ljg3NDQ0MTY4OTkwNTA3LCJrZWVwR29pbmciOmZhbHNlLCJoYXNOYU4iOmZhbHNlLCJwb2ludHMiOjAsInN1YnRhYnMiOnsiY2hhbmdlbG9nLXRhYiI6e30sImciOnsibWFpblRhYnMiOiJVcGdyYWRlcyJ9LCJkZXYiOnsibWFpblRhYnMiOiJQb2ludCBhZGQifX0sImxhc3RTYWZlVGFiIjoidG9reSIsImluZm9ib3hlcyI6e30sImluZm8tdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTI2Ljg3NDQ0MTY4OTkwNTA3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sIm9wdGlvbnMtdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTI2Ljg3NDQ0MTY4OTkwNTA3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImNoYW5nZWxvZy10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMjYuODc0NDQxNjg5OTA1MDcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwicyI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjowLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTI2Ljg3NDQ0MTY4OTkwNTA3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOlsxMSwxMiwxMywxNCwxNSwyMywyNCwzMywzNCwyMiwyMSwzMSwzMiw0MSw0Myw0NCw1Miw1MSw1Myw1NCw0Ml0sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiYyI6eyJwb2ludHMiOjAsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMjYuODc0NDQxNjg5OTA1MDcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjEyIjoiIn0sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6WzExLDEyLDEzLDE0LDIxLDIyLDIzLDI0LDI1XSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJnIjp7InBvaW50cyI6IjAiLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTI2Ljg3NDQ0MTY4OTkwNTA3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6eyIxMSI6MH0sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImEiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiI4IiwicmVzZXRUaW1lIjoxMjYuODc0NDQxNjg5OTA1MDcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOlsiMTEiLCI5MSIsIjkyIiwiOTMiLCIxMiIsIjEzIiwiMTUiLCIxNCJdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIiLCJwb2ludHMiOiI4In0sImRldiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjEyNi44NzQ0NDE2ODk5MDUwNywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7IjExIjoiIiwiMjEiOiIiLCIyMiI6IiIsIjIzIjoiIiwiMzEiOiIiLCIzMiI6IiIsIjMzIjoiIiwiMzQiOiIiLCIzNSI6IiIsIjQxIjoiIiwiNDIiOiIiLCI0MyI6IiIsIjQ0IjoiIiwiNTEiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJibGFuayI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjEyNi44NzQ0NDE2ODk5MDUwNywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJ0cmVlLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjEyNi44NzQ0NDE2ODk5MDUwNywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJnbm8iOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMjYuODc0NDQxNjg5OTA1MDcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwidG9reSI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMCIsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMjYuODc0NDQxNjg5OTA1MDcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifX0=")
            }
        },
        501: {
            display: "Set devSpeed to <br><font size = +1>100%</font>",
            onClick() {player.devSpeed = new Decimal(1)},
            canClick: true,
        },
        502: {
            display: "Set devSpeed to <br><font size = +1>1000%</font>",
            onClick() {player.devSpeed = new Decimal(10)},
            canClick: true,
        },
        503: {
            display: "Set devSpeed to <br><font size = +1>10000%</font>",
            onClick() {player.devSpeed = new Decimal(100)},
            canClick: true,
        }
    }
})