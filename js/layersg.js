//layers for challenges(G), not done
addLayer("gno", {
    name: "gno",
    symbol: "GNO",
    color: "#3422FF",
    resource: "gno",
    type: "none",
    branches: ["g"],
    exponent: 0.5,
    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return new Decimal(1)
    },
    tabFormat: [
        ["display-text", function() { return "You are not in any challenge"}],
    ]}),
addLayer("toky", {
    name: "toky",
    symbol: "ToKY",
    color: "#3422FF",
    resource: "Challenge Points",
    type: "none",
    branches: ["g"],
    startData() { return {                  
        unlocked: true,                     
        points: new Decimal(0),             
    }},
    gainMult() {
        mult = new Decimal(0)
        if (inChallenge('g', 11)) {mult = mult.add(1)}
        else {
            player.toky.points = new Decimal(0);
            doReset(this.layer)
        }
        //Global
        if (hasUpgrade('c', 15)) mult = mult.times(2.2)
        if (hasAchievement('a', 94)) mult = mult.times(totalg.add(2).times(0.5))
        if (hasUpgrade('g', 11)) mult = mult.times(upgradeEffect('g', 11));

        //Layer
        if (hasUpgrade('toky', 11)) mult = mult.times(3);
        if (hasUpgrade('toky', 12)) mult = mult.times(upgradeEffect('toky', 12));
        if (hasUpgrade('toky', 13)) mult = mult.times(10);
        if (hasUpgrade('toky', 14)) mult = mult.times(9);
        if (hasUpgrade('toky', 15)) mult = mult.times(10);
        return mult
    },
    gainExp() {
           return new Decimal(1)
    },
    update(diff) {
        tokyGain = tmp.toky.gainMult;
        player.toky.points = player.toky.points.plus(tokyGain.times(diff))
    },
    deactivated() {
        return !(inChallenge('g', 11))
    },
    tabFormat: [
        ["display-text", function() { return "You are in ToKY challenge"}],
        "main-display",
        "blank",
        ["display-text", function() {return "Your Challenge Points has boost of x<em>"+format(tmp[this.layer].gainMult)+"</em>"}],
        "blank",
        "upgrades"
    ],
    upgrades: {
        11: {
            title: "ToKY#1: Snakes",
            description: "Get trapped. Triple CP boost",
            cost: new Decimal(25)
        },
        12: {
            title: "ToKY#2: Scary conveyor",
            description: "???. CP boost CP",
            tooltip: "CP<sup>0.2</sup>",
            cost: new Decimal(75),
            unlocked() {
                return hasUpgrade('toky', 11)
            },
            effect() {
                let eff = player[this.layer].points.add(1).pow(0.2)
                return eff
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }
        },
        13: {
            title: "ToKY#3: ???",
            description: "Ice. tenfold CP",
            cost: new Decimal(450),
            unlocked() {
                return hasUpgrade('toky', 12)
            }
        },
        14: {
            title: "ToKY#4: Remember it",
            description: "MMLRLMRRL. CP boost by the length of the words",
            tooltip: "Length = 9",
            cost: new Decimal(5000),
            unlocked() {
                return hasUpgrade('toky', 13)
            }
        },
        15: {
            title: "ToKY#5: Final Jump",
            description: "Sudden hard gameplay. Boost CP by floor amount of ToKY",
            tooltip: "Floor amount = 10",
            cost: new Decimal(75000),
            unlocked() {
                return hasUpgrade('toky', 14)
            }
        }
    }
}),
addLayer("toch", {
    name: "toch",
    symbol: "ToCH",
    color: "#3422FF",
    resource: "Challenge Points",
    type: "none",
    branches: ["g"],
    startData() { return {                  
        unlocked: true,                     
        points: new Decimal(0),             
    }},
    gainMult() {
        mult = new Decimal(0);
        if (inChallenge('g', 12)) {mult = mult.add(1)}
        else {
            player.toch.points = new Decimal(0);
            doReset(this.layer)
        }
        //Global
        if (hasUpgrade('c', 15)) mult = mult.times(2.2)
        if (hasAchievement('a', 94)) mult = mult.times(totalg.add(2).times(0.5))
        if (hasUpgrade('g', 11)) mult = mult.times(upgradeEffect('g', 11));

        //Layer
        mult = mult.times(1.5**getBuyableAmount('toch', 11));
        if (hasUpgrade('toch', 13)) mult = mult.times(3)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    update(diff) {
        tochGain = tmp.toch.gainMult;
        player.toch.points = player.toch.points.plus(tochGain.times(diff))
    },
    deactivated() {
        return !(inChallenge('g', 12))
    },
    tabFormat: [
        ["display-text", function() { return "You are in ToCH challenge"}],
        "main-display",
        "blank",
        ["display-text", function() {return "Your Challenge Points has boost of x<em>"+format(tmp[this.layer].gainMult)+"</em>"}],
        "blank",
        "buyables",
        "blank",
        "upgrades"
    ],
    upgrades: {
        11: {
            title: "ToCH#1: Get to floor 2",
            description: "Help i have no idea in ToCH.",
            cost: new Decimal(25)
        },
        12: {
            title: "ToCH#2: Unlock buyable",
            cost: new Decimal(50),
            unlocked() {
                return hasUpgrade('toch', 11)
            }
        },
        13: {
            title: "ToCH#4: Outside Jumping",
            description: "Long and boring. Triple CP gain",
            cost: new Decimal(200),
            unlocked() {
                return hasUpgrade('toch', 12)
            }
        }
    },
    buyables: {
        11: {
            title: "ToCH#3: Warpping",
            cost() {
                return new Decimal(5).times(getBuyableAmount('toch', 11).add(1)).pow(2)
            },
            display() {return "x1.5 CP per upgrade<br>" + 
            "Amount: "+ format(getBuyableAmount('toch', 11))+ "/5.00" +
            "<br>Cost: "+format(this.cost())+ " CP"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player.toch.points = player.toch.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: 5,
            unlocked() {
                return hasUpgrade('toch', 12)
            }

        }
    }
})