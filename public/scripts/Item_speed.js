const Item_speed=function(ctx, x, y){
    const sequences={
        one:  { x: 144, y:48, width: 16, height: 16, count: 1, timing: 200, loop: true },
    };

    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.one)
        .setScale(2)
        .setShadowScale({ x: 0, y: 0 })
        .useSheet("img/object_sprites.png");

    let birthTime = performance.now();
    let name="Speed";

    // This function sets the color of the gem.
    // - `color` - The colour of the gem which can be
    // `"green"`, `"red"`, `"yellow"` or `"purple"`

    // This function gets the age (in millisecond) of the gem.
    // - `now` - The current timestamp
    const getAge = function(now) {
        return now - birthTime;
    };

    // This function randomizes the gem colour and position.
    // - `area` - The area that the gem should be located in.
    const randomize = function(area) {

        /* Randomize the position */
        const {x, y} = area.randomPoint();
        sprite.setXY(x, y);
        birthTime=performance.now()
    };
    const hide=function(){
        this.setXY(2000, 30);


    }



    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        randomize:randomize,
        getAge: getAge,
        hide:hide,
        getX:sprite.getX,
        getY:sprite.getY,
        name:name
    };
}