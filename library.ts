namespace kojac {
    export type LibraryFn = (rule: Rule) => void;
 
    export type LibraryFnMap = {
        [id: string]: LibraryFn;
    };

    export class Library {
        public static getFunction(id: string): LibraryFn {
            id = id || "noop";
            return librarydb[id] || librarydb["noop"];
        }
    }

    type Target = {
        char: Character;
        distSq: number;
    };

    const DIST_CUTOFF_SQ = 3000;

    const librarydb: LibraryFnMap = {
        "noop": (rule: Rule) => { },

        ///
        /// SENSORS
        ///
        [tid.sensor.always]: (rule: Rule) => {
            rule.state["exec"] = true;
        },

        [tid.sensor.see]: (rule: Rule) => {
            // Select characters except the one executing this.
            const chars = rule.prog.char.stage.components
                .filter(comp => comp.kind === "character" && comp !== rule.prog.char) as Character[];
            // Sort by distance, near to far.
            const targets = chars
                .map(char => {
                    return <Target>{
                        char: char,
                        distSq: util.distSqBetweenSprites(char.kelpie, rule.prog.char.kelpie)
                    }
                })
                .sort((a, b) => a.distSq - b.distSq);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.sensor.bump]: (rule: Rule) => {
            const chars: Character[] = rule.prog.char.bumps || [];
            // Map to targets.
            const targets = chars
                .map(char => {
                    return <Target>{
                        char: char,
                        distSq: 0
                    }
                });
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.sensor.dpad]: (rule: Rule) => {
            const direction = mkVec2();
            if (controller.up.isPressed()) { direction.y -= 1; }
            if (controller.down.isPressed()) { direction.y += 1; }
            if (controller.left.isPressed()) { direction.x -= 1; }
            if (controller.right.isPressed()) { direction.x += 1; }
            if (direction.x || direction.y) {
                rule.state["exec"] = true;
                rule.state["direction"] = direction;
            }
        },

        [tid.sensor.button_a]: (rule: Rule) => {
            if (controller.A.isPressed()) {
                rule.state["exec"] = true;
            }
        },

        [tid.sensor.button_b]: (rule: Rule) => {
            if (controller.B.isPressed()) {
                rule.state["exec"] = true;
            }
        },

        [tid.sensor.timer]: (rule: Rule) => {
            const timerStart = rule.prevState["timerStart"] || control.millis();
            rule.state["timerStart"] = timerStart;
            const now = control.millis();
            const timespan = rule.state["timespan"] || 1000;
            const elapsed = now - timerStart;
            if (elapsed >= timespan) {
                rule.state["exec"] = true;
                rule.state["timerStart"] = now;
            }
        },

        ///
        /// FILTERS
        ///
        [tid.filter.me]: (rule: Rule) => {
            rule.state["targets"] = [{
                char: rule.prog.char,
                distSq: 0
            }] as Target[];
            rule.state["exec"] = true;
        },

        [tid.filter.it]: (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets || !targets.length) { return; }
            targets = targets.slice(0, 1);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.nearby]: (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            if (!rule.state["dist_cutoff_sq"]) {
                rule.state["dist_cutoff_sq"] = DIST_CUTOFF_SQ;
            } else {
                rule.state["dist_cutoff_sq"] *= 0.5;
            }
            const distCutoffSq: number = rule.state["dist_cutoff_sq"];
            targets = targets.filter(targ => targ.distSq < distCutoffSq);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.faraway]: (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            if (!rule.state["dist_cutoff_sq"]) {
                rule.state["dist_cutoff_sq"] = DIST_CUTOFF_SQ;
            } else {
                rule.state["dist_cutoff_sq"] *= 1.5;
            }
            const distCutoffSq: number = rule.state["dist_cutoff_sq"];
            targets = targets.filter(targ => targ.distSq >= distCutoffSq);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.kodu]:  (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            targets = targets.filter(targ => targ.char.defn.id === "kodu");
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.apple]:  (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            targets = targets.filter(targ => targ.char.defn.id === "apple");
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.tree]:  (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            targets = targets.filter(targ => targ.char.defn.id === "tree");
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.timespan_short]: (rule: Rule) => {
            let timespan: number = rule.state["timespan"] || 1000;
            timespan /= 2.0;
            rule.state["timespan"] = timespan;
        },

        [tid.filter.timespan_long]: (rule: Rule) => {
            let timespan: number = rule.state["timespan"] || 1000;
            timespan += 1000;
            rule.state["timespan"] = timespan;
        },

        [tid.filter.express_none]: (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            targets = targets.filter(targ => targ.char.prog.feeling === Feeling.None);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.express_happy]: (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            targets = targets.filter(targ => targ.char.prog.feeling === Feeling.Happy);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.express_angry]: (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            targets = targets.filter(targ => targ.char.prog.feeling === Feeling.Angry);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.express_heart]: (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            targets = targets.filter(targ => targ.char.prog.feeling === Feeling.Heart);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        [tid.filter.express_sad]: (rule: Rule) => {
            let targets: Target[] = rule.state["targets"];
            if (!targets) { return; }
            targets = targets.filter(targ => targ.char.prog.feeling === Feeling.Sad);
            rule.state["targets"] = targets;
            rule.state["exec"] = targets.length > 0;
        },

        ///
        /// ACTUATORS
        ///
        [tid.actuator.move]: (rule: Rule) => {
            const dir = rule.state["direction"];
            if (!dir) { return; }
            const actor = rule.prog.char;
            const speed = rule.state["speed"] || actor.defn.defaults.speed;
            const impulseType: ImpulseType = rule.state["exclusive-move"] ? ImpulseType.Exclusive : ImpulseType.Ambient;
            actor.queueImpulse(dir, speed, impulseType);
        },

        [tid.actuator.switch_page]: (rule: Rule) => {
            const page: number = rule.state["page"];
            if (page !== undefined) {
                rule.prog.switchPage(page);
            }
        },

        [tid.actuator.vanish]: (rule: Rule) => {
            const targets: Target[] = rule.state["targets"];
            let vanishee: Character = rule.prog.char;
            if (targets && targets.length) {
                vanishee = targets[0].char;
            }
            if (vanishee) {
                vanishee.destroy();
            }
        },

        [tid.actuator.camera_follow]: (rule: Rule) => {
            const targets: Target[] = rule.state["targets"];
            let target: Character = rule.prog.char;
            if (targets && targets.length) {
                target = targets[0].char;
            }
            if (target) {
                rule.prog.cameraFollow(target);
            }
        },

        [tid.actuator.express]: (rule: Rule) => {
            let expressee: Character = rule.prog.char;
            if (rule.state["direct-target"]) {
                expressee = rule.state["direct-target"].char;
            }
            let feeling = rule.state["feeling"];
            if (expressee && feeling !== undefined) {
                expressee.prog.feel(feeling);
            }
        },

        ///
        /// MODIFIERS
        ///
        [tid.modifier.me]: (rule: Rule) => {
            const targets: Target[] = [{
                char: rule.prog.char,
                distSq: 0
            }];
            rule.state["targets"] = targets;
            rule.state["direct-target"] = targets[0];
        },

        [tid.modifier.it]: (rule: Rule) => {
            let targets = rule.state["targets"] as Target[];
            rule.state["targets"] = undefined;
            if (!targets || !targets.length) { return; }
            targets = targets.slice(0, 1);
            rule.state["targets"] = targets;
            rule.state["direct-target"] = targets[0];
        },

        [tid.modifier.quickly]: (rule: Rule) => {
            const actor = rule.prog.char;
            const speed = rule.state["speed"] || actor.defn.defaults.speed;
            rule.state["speed"] = speed + actor.defn.defaults.speed * 0.5;
        },

        [tid.modifier.slowly]: (rule: Rule) => {
            const actor = rule.prog.char;
            const speed = rule.state["speed"] || actor.defn.defaults.speed;
            rule.state["speed"] = speed * 0.75;
        },

        [tid.modifier.toward]: (rule: Rule) => {
            const targets = rule.state["targets"] as Target[];
            if (!targets || !targets.length) { return; }
            const target = targets[0];
            const actor = rule.prog.char;
            let dx = target.char.x - actor.x;
            let dy = target.char.y - actor.y;
            const dist = util.distBetweenSprites(target.char.kelpie, actor.kelpie);
            if (!dist) { return; }
            dx /= dist;
            dy /= dist;
            rule.state["direction"] = mkVec2(dx, dy);
        },

        [tid.modifier.away]: (rule: Rule) => {
            const targets = rule.state["targets"] as Target[];
            if (!targets || !targets.length) { return; }
            const target = targets[0];
            const actor = rule.prog.char;
            let dx = target.char.x - actor.x;
            let dy = target.char.y - actor.y;
            const dist = util.distBetweenSprites(target.char.kelpie, actor.kelpie);
            if (!dist) { return; }
            dx /= dist;
            dy /= dist;
            rule.state["direction"] = mkVec2(-dx, -dy);
        },

        [tid.modifier.avoid]: (rule: Rule) => {
            const targets = rule.state["targets"] as Target[];
            if (!targets || !targets.length) { return; }
            const target = targets[0];
            const actor = rule.prog.char;
            const vToTarget = Vec2.Sub(target.char.pos, actor.pos);
            const vToTargetN = Vec2.Normal(vToTarget);
            // Evaluates the actor's queued impulses and returns a normalized direction.
            const direction = actor.nextDirection();
            const dot = Vec2.Dot(direction, vToTargetN);
            // Already moving away?
            if (dot < 0) { return; }
            let vSignDir = mkVec2(-1, 1);
            const vTranspose = Vec2.Transpose(vToTargetN);
            if (direction) {
                if (Math.abs(direction.x) > Math.abs(direction.y)) {
                    vSignDir.y = (actor.y > target.char.y) ? 1 : -1;
                    vTranspose.y = Math.abs(vTranspose.y);
                } else {
                    vSignDir.x = (actor.x > target.char.x) ? 1 : -1;
                    vTranspose.x = Math.abs(vTranspose.x);
                }
            }
            rule.state["direction"] = Vec2.Mul(vTranspose, vSignDir);
            //rule.state["exclusive-move"] = true;
        },

        [tid.modifier.page_1]: (rule: Rule) => {
            rule.state["page"] = 0;
        },

        [tid.modifier.page_2]: (rule: Rule) => {
            rule.state["page"] = 1;
        },
        
        [tid.modifier.page_3]: (rule: Rule) => {
            rule.state["page"] = 2;
        },
        
        [tid.modifier.page_4]: (rule: Rule) => {
            rule.state["page"] = 3;
        },
        
        [tid.modifier.page_5]: (rule: Rule) => {
            rule.state["page"] = 4;
        },

        [tid.modifier.express_none]: (rule: Rule) => {
            rule.state["feeling"] = Feeling.None;
        },

        [tid.modifier.express_happy]: (rule: Rule) => {
            rule.state["feeling"] = Feeling.Happy;
        },
        
        [tid.modifier.express_angry]: (rule: Rule) => {
            rule.state["feeling"] = Feeling.Angry;
        },
        
        [tid.modifier.express_heart]: (rule: Rule) => {
            rule.state["feeling"] = Feeling.Heart;
        },
        
        [tid.modifier.express_sad]: (rule: Rule) => {
            rule.state["feeling"] = Feeling.Sad;
        },
        
    }
}