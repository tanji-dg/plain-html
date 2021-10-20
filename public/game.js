kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('fabiola', 'skGbVGE.png')
loadSprite('alberto', 'kmocSJK.png')
loadSprite('alberto-g', 'uoZkvZe.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')

const PLAYERS = {
    alberto: {
        menu: 'alberto-g',
        idle: 'alberto-g'
    },
    fabiola: {
        menu: 'fabiola',
        idle: 'fabiola'
    }
}

scene("menu", ({ level, score }) => {
    const screenCenter = { x: width() / 2, y: height() / 2 }
    const PADDING = 20

    add([text("Select Player", 32), origin('center'), pos(screenCenter.x, screenCenter.y - 10*PADDING)])

    const fabiola = add([
        sprite(PLAYERS.fabiola.menu),
        'fabiola',
        'player',
        scale(5),
        origin('center'),
        solid(),
        pos(screenCenter.x - 10 * PADDING, screenCenter.y )
    ])

    const alberto = add([
        sprite(PLAYERS.alberto.menu),
        'alberto',
        'player',
        scale(5),
        origin('center'),
        solid(),
        pos(screenCenter.x + 10 * PADDING, screenCenter.y)
    ])

    clicks('fabiola', (f) => {
        go('game', {
            selectedPlayer: PLAYERS.fabiola,
            score: 0,
            level: 0
        })
    })

    clicks('alberto', (a) => {
        go('game', {
            selectedPlayer: PLAYERS.alberto,
            score: 0,
            level: 0
        })
    })

})

scene("game", ({ selectedPlayer, level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [
        [
            '                                         ',
            '                                         ',
            '                                         ',
            '                                         ',
            '     %   =*=%=                           ',
            '                                         ',
            '                              -+         ',
            '                     ^     ^  ()         ',
            '================================    =====',
        ],
        [
            '&                                         &',
            '&                                         &',
            '&                                         &',
            '&                                         &',
            '&     @   @*@%@                x          &',
            '&                           x  x  x       &',
            '&                        x  x  x  x  x  -+&',
            '&             z     z    x  x  x  x  x  ()&',
            '&!!!!!!!!!!!!!!!!!!!!!!                 !!!',
        ]
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '$': [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '^': [sprite('evil-shroom'), solid(), 'dangerous'],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],


        '!': [sprite('blue-block'), solid(), scale(0.5)],
        '&': [sprite('blue-brick'), solid(), scale(0.5)],
        'x': [sprite('blue-steel'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(), 'dangerous', scale(0.5)],
        '@': [sprite('blue-surprise'), solid(), 'coin-surprise', scale(0.5)],

    }

    const gameLevel = addLevel(maps[level], levelCfg)

    // Player config
    const INVULNERABILITY_AFTER_HIT_TIME = 1
    const FALL_DEATH = 800
    const BIGGIFY_TIME = 6
    const MOVE_SPEED = 120
    const JUMP_FORCE = 360
    const BIG_JUMP_FORCE = 550
    let CURRENT_JUMP_FORCE = JUMP_FORCE
    // Props config
    // Mushroom
    const MUSHROOM_SPEED = 50
    // Enemies
    const ENEMY_SPEED = -30
    // props
    const COIN_SCORE = 1

    const scoreLabel = add([
        text('Score: ' + parseInt(score)),
        pos(5, 25),
        layer('ui'),
        {
            value: score,
            updateScore(s) {
                this.value += s
                this.text = 'Score: ' + parseInt(this.value)
            }
        }
    ])

    add([
        text('level ' + parseInt(level + 1)),
        pos(4, 6),
        layer('ui')
    ])

    function big() {
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                    timer -= dt()

                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                CURRENT_JUMP_FORCE = JUMP_FORCE
                this.scale = vec2(1)
                timer = 0
                isBig = false
            },
            biggify(time) {
                CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                this.scale = vec2(2)
                timer = time
                isBig = true
            }
        }
    }

    function invulnerability() {
        let timer = 0
        let isInvulnerable = false

        return {
            isInvulnerable() {
                return isInvulnerable
            },
            startInvulnerability(time) {
                isInvulnerable = true
                timer = time
            },
            stopInvulnerability() {
                isInvulnerable = false
                timer = 0

                // Check if player should get hit
                let dangerous = get('dangerous')
                for (let d of dangerous) {
                    if (this.isCollided(d)) {
                        this.handleCollisionWithDangerous(d)
                        break
                    }
                }
            },
            update() {
                if (isInvulnerable) {
                    timer -= dt()

                    if (timer <= 0) {
                        this.stopInvulnerability()
                    }
                }
            }
        }
    }

    const GROUND_FRICTION = 1000
    const AIR_FRICTION = 50
    const SMALL_NUMBER = 0.1
    const SPEED_TOLERANCE = 10

    function playerMovementComp() {
        let speed = 0
        let requestedRight = false
        let requestedLeft = false

        return {
            moveRight(requested) {
                requestedRight = requested
            },
            moveLeft(requested) {
                requestedLeft = requested
            },
            updateMove() {
                if (requestedLeft) {
                    speed = -MOVE_SPEED
                }
                else if (requestedRight) {
                    speed = MOVE_SPEED
                }
                else if (Math.abs(speed) > SPEED_TOLERANCE) {
                    const dir = speed > 0 ? 1 : -1
                    const friction = this.grounded() ? GROUND_FRICTION : AIR_FRICTION

                    speed += -dir * friction * dt()
                }
                else {
                    speed = 0
                }

                this.move(speed, 0)
            }
        }
    }

    function jumpAbility() {
        let jumps = 0
        let isJumping = false
        let maxJumps = 2
        let isJumpPressed = false

        return {
            canJump() {
                return !isJumpPressed && (this.grounded() ||
                    (isJumping && jumps < maxJumps))
            },
            isJumping() {
                return isJumping
            },
            update() {
                if (this.grounded()) {
                    jumps = 0
                    isJumping = false
                }
            },
            tryJump() {
                if (this.canJump()) {
                    jumps += 1
                    isJumping = true
                    this.jump(CURRENT_JUMP_FORCE)
                }
                isJumpPressed = true
            },
            clearJumpInput() {
                isJumpPressed = false
            }
        }
    }

    function collisionManagement() {
        return {
            handleCollisionWithDangerous(d) {
                if (d != null) {
                    if (this.curPlatform() == d) {
                        destroy(d)
                        if (keyIsDown('space')) {
                            this.clearJumpInput()
                            this.tryJump()
                        }
                    }
                    else if (this.isBig()) {
                        this.smallify()
                        this.startInvulnerability(INVULNERABILITY_AFTER_HIT_TIME)
                    }
                    else if (!this.isInvulnerable()) {
                        go('lose', { score: scoreLabel.value })
                    }
                }
            }
        }
    }

    const player = add([
        sprite(selectedPlayer.idle),
        scale(.8),
        solid(),
        pos(30, 0),
        body(),
        big(),
        jumpAbility(),
        invulnerability(),
        collisionManagement(),
        playerMovementComp(),
        origin('bot')
    ])

    action('mushroom', (m) => {
        m.move(MUSHROOM_SPEED, 0)
    })

    player.on('headbump', (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))

        }
    })

    player.on('headbump', (obj) => {
        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))

        }
    })

    player.collides('mushroom', (m) => {
        destroy(m)
        player.biggify(BIGGIFY_TIME)
    })

    player.collides('coin', (m) => {
        destroy(m)
        scoreLabel.updateScore(COIN_SCORE)
    })

    action('dangerous', (d) => {
        d.move(ENEMY_SPEED, 0)
    })

    player.collides('dangerous', (d) => {
        player.handleCollisionWithDangerous(d)
    })

    player.action(() => {
        camPos(player.pos)

        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLabel.value })
        }
        else {
            player.updateMove()
        }
    })

    player.collides('pipe', (p) => {
        keyPress('down', () => {
            if (player.curPlatform() == p) {
                go('game', {
                    selectedPlayer: selectedPlayer,
                    score: scoreLabel.value,
                    level: ((level + 1) % maps.length)
                })

            }
        })
    })

    keyDown('left', () => {
        player.moveLeft(true)
    })

    keyRelease('left', () => {
        player.moveLeft(false)
    })

    keyDown('right', () => {
        player.moveRight(true)
    })

    keyRelease('right', () => {
        player.moveRight(false)
    })

    keyDown('space', () => {
        player.tryJump()
    })

    keyRelease('space', () => {
        player.clearJumpInput()
    })
})

scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)])
})

start("menu", { level: 0, score: 0 })
