const Gamestart = function(){
    const start = function(){
        /* Get the canvas and 2D context */
        const cv = $("canvas").get(0);
        const context = cv.getContext("2d");

        const totalGameTime = 20;   // Total game time in seconds
        const itemMaxAge = 3000;     // The maximum age of the gems in milliseconds
        const trapMaxAge=4000;
        let gameStartTime = 0;      // The timestamp when the game starts
        let collectedGems = 0;      // The number of gems collected in the game

        /* Create the game area */
        const gameArea = BoundingBox(context, 245, -20, 400, 880);

        /* Create the sprites in the game */

        const player = Character_Berserker(context, 200, 260, gameArea); // The player
        const player2= Character_Swordsman(context,200,380,gameArea);
        [x,y]=gameArea.getPoints().topLeft;
        [a,b]=gameArea.getPoints().topRight;
        [c,d]=gameArea.getPoints().bottomRight;
        [e,h]=gameArea.getPoints().bottomLeft;

        const sounds = {

            collect: new Audio("../music/collect.mp3"),

        };

        /* create mob in the game */
        let mobs = [];
        let mobNum = 0;
        let mobID = 0;
        const mobTime = Math.random()*7000;
        function spawnMob(){
            if(mobNum<=20){
                let choice = Math.floor(Math.random() * 4);
                if(choice === 0){
                    mobs[mobID] =  Mob_Bat(context, 700+Math.random()*100, 260+Math.random()*100, gameArea);
                    mobNum++;mobID++;
                }
                else if(choice === 1 ){
                    mobs[mobID] =  Mob_Sprite(context, 700+Math.random()*100, 260+Math.random()*100, gameArea);
                    mobNum++;mobID++;
                }
                else{
                    mobs[mobID] = Mob_Slime(context, 700+Math.random()*100, 260+Math.random()*100, gameArea);
                    //mobs[mobID] = Mob_Shinigami(context, 700+Math.random()*150, 260+Math.random()*150, gameArea);
                    mobNum++;mobID++;
                }
                if(mobNum === 19){
                    mobs[mobID] = Mob_Shinigami(context, 700+Math.random()*100, 260+Math.random()*100, gameArea);
                    mobNum++;mobID++;
                }
            }
            setTimeout(spawnMob,mobTime);
        }
        setTimeout(spawnMob,mobTime);


        /* create items in the game */
        const chest = Item_Chest(context, 427, 350, gameArea);
        //const attack = Attack(context, 427, 350, "green");        // The gem


        let items = [];
        let itemID = 0;
        let itemNub=0;
        const itemTime = Math.random()*9000;
        function spawnItem(){
                let choice =Math.floor(Math.random() * 3);
                if(choice === 0){
                    items[itemID] =  Item_Heart(context, Math.random()*800, 260+Math.random()*150, gameArea);

                    itemNub++;itemID++;
                }
                 else if(choice === 1){
                    items[itemID] =  Item_Fire(context, Math.random()*800, 260+Math.random()*150, gameArea);
                    itemNub++;itemID++;

                }
                else if(choice === 2){
                    items[itemID] =  Item_speed(context, Math.random()*800, 260+Math.random()*150, gameArea);
                    itemNub++;itemID++;

                }
                // else{
                //     items[itemID] = Mob_Slime(context, 700+Math.random()*150, 260+Math.random()*150, gameArea);
                //     items[itemID] = Mob_Shinigami(context, 700+Math.random()*150, 260+Math.random()*150, gameArea);
                //     itemNub++;itemID++;
                // }

            setTimeout(spawnItem,itemTime);
        }
        setTimeout(spawnItem,itemTime);

        /* The main processing of the game */
        function doFrame(now) {
            if (gameStartTime === 0) gameStartTime = now;

            /* Update the time remaining */
            const gameTimeSoFar = now - gameStartTime;
            const timeRemaining = Math.ceil((totalGameTime * 1000 - gameTimeSoFar) / 1000);
            $("#time-remaining").text(timeRemaining);


            /* Handle the game over situation here */
            // if(timeRemaining<=0)
            // {
            //     $("#final-gems").html(collectedGems);
            //     $("#game-over").show();
            //     sounds.background.pause();
            //     sounds.gameover.play();
            //     return;
            // }

            /* Update the sprites */
            //attack.update(now);
            player.update(now);
            chest.update(now);
            player2.update(now);
            for(let i = 0; i<mobs.length;i++){
                mobs[i].update(now);
            }
            for(let i = 0; i<itemNub;i++){
                items[i].update(now);
            }



            // Check
            for (let i=0;i<items.length;i++) {
                let x = items[i].getX();
                let y = items[i].getY();
                const box = player.getBoundingBox();
                if (box.isPointInBox(x, y)) {

                    if(items[i].name==="Heart")
                    {
                        sounds.collect.pause();
                        sounds.collect.load();
                        sounds.collect.play();
                        player.increaseLife();

                        items[i].hide();
                    }
                    else if(items[i].name==="Fire")
                    {
                       player.decreaseLife();
                        items[i].hide();
                    }
                    else if(items[i].name==="Speed")
                    {
                        player.increaseSpeed();
                        items[i].hide();
                    }


                    //heart.randomize(gameArea);
                }
            }
           //Dis
            for (let i=0;i<items.length;i++) {
                if(items[i].name==="Heart")
                {
                    if(items[i].getAge(now)>itemMaxAge)
                    {
                        items[i].hide();
                    }
                }
                else if(items[i].name==="Fire")
                {
                    if(items[i].getAge(now)>trapMaxAge)
                    {
                        items[i].hide();
                    }
                }
                else if(items[i].getAge(now)>itemMaxAge)
                {
                    items[i].hide();
                }

            }







            /* Clear the screen */
            context.clearRect(0, 0, cv.width, cv.height);

            /* Draw the sprites */
            //attack.draw();

            chest.draw();
            player.draw();
            player2.draw();
            for(let i = 0; i<mobs.length;i++){
                mobs[i].draw();
            }
            for(let i = 0; i<items.length;i++){
                items[i].draw(now);
            }



            /* Process the next frame */
            requestAnimationFrame(doFrame);
        };

        /* Handle the start of the game */

        /* Randomize the dir and move mob  */
        function movement(){
            for(let i = 0; i<mobNum;i++){
                let mobDir = Math.floor(Math.random() * 8);
                    if(mobDir>=5){
                        mobs[i].move(1);
                    }
                    else{
                        mobs[i].move(mobDir);
                    }
            }
            setTimeout(movement,1000+Math.random() * 500);
        }
        setTimeout(movement,1000+Math.random() * 500);

        /* spawn items */



        /* Handle the keydown of arrow keys and spacebar */
        $(document).on("keydown", function(event) {

            /* Handle the key down */
            switch(event.keyCode){
                case 37:player.move(1);break
                case 38:player.move(2);break;
                case 39:player.move(3);break;
                case 40:player.move(4);break;
                case 32:player.attack();break;
                case 65:player2.move(1);break;
                case 87:player2.move(2);break;
                case 68:player2.move(3);break;
                case 83:player2.move(4);break;
                case 75:player2.attack();break;
            }
         });

        /* Handle the keyup of arrow keys and spacebar */
        $(document).on("keyup", function(event) {
            /* Handle the key up */
            switch(event.keyCode){
                case 37:player.stop(1);break;
                case 38:player.stop(2);break;
                case 39:player.stop(3);break;
                case 40:player.stop(4);break;
                case 32:player.attackdone();break;
                case 65:player2.stop(1);break;
                case 87:player2.stop(2);break;
                case 68:player2.stop(3);break;
                case 83:player2.stop(4);break;
                case 75:player2.attackdone();break;

            }

        });

        // /* Start the game */
        requestAnimationFrame(doFrame);
    }

    return {start}
}();