addLayer("timese3", {
    name: "toch",
    symbol: "ToCH",
    color: "#3422FF",
    resource: "time for SE3",
    type: "none",
    branches: ["g"],
    startData() { return {                  
        unlocked: true,                     
        points: new Decimal(0.0001),             
    }},
    gainMult() {
        se3Mult = new Decimal(0);
        if (hasUpgrade('g', 11)) se3Mult = se3Mult.add(1)
        return se3Mult
    },
    update(diff) {
        se3Gain = tmp.timese3.gainMult;
        player.timese3.points = player.timese3.points.plus(se3Gain.times(diff))
    },
})