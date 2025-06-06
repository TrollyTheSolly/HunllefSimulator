class RandomRange {
    random_int(upper_inclusive) {
        return Math.floor(Math.random() * (upper_inclusive + 1));
    }

    random_player_damage(upper_inclusive){
        return Math.floor(Math.random() * upper_inclusive) + 1;
    }

    random_double() {
        return Math.random();
    }
}

class Prayer {
    constructor(new_prayer_name) {
        this.range_attack = 1.0;
        this.mage_attack = 1.0;
        this.range_defence = 1.0;
        this.mage_defence = 1.0;
        this.range_strength_multiplier = 1.0;
        this.mage_damage_multiplier = 1.0;

        if (new_prayer_name === "RIGOUR") {
            this.range_attack = 1.20;
            this.range_strength_multiplier = 1.23;
            this.range_defence = 1.25;
        } else if (new_prayer_name === "AUGURY") {
            this.mage_attack = 1.25;
            this.mage_defence = 1.25;
            this.mage_damage_multiplier = 1.04;
        } else if (new_prayer_name === "EAGLEEYE") {
            this.range_attack = 1.15;
            this.range_strength_multiplier = 1.15;
        } else if (new_prayer_name === "MYSTICMIGHT") {
            this.mage_attack = 1.15;
            this.mage_defence = 1.15;
        } else if (new_prayer_name === "SHARPEYE") {
            this.range_attack = 1.05;
            this.range_strength_multiplier = 1.05;
        } else if (new_prayer_name === "HAWKEYE") {
            this.range_attack = 1.10;
            this.range_strength_multiplier = 1.10;
        } else if (new_prayer_name === "DEADEYE") {
            this.range_attack = 1.18;
            this.range_strength_multiplier = 1.18;
            this.range_defence = 1.05;
        } else if (new_prayer_name === "MYSTICWILL") {
            this.mage_attack = 1.05;
            this.mage_defence = 1.05;
        } else if (new_prayer_name === "MYSTICLORE") {
            this.mage_attack = 1.10;
            this.mage_defence = 1.10;
        } else if (new_prayer_name === "MYSTICVIGOUR") {
            this.mage_attack = 1.18;
            this.mage_defence = 1.18;
            this.mage_damage_multiplier = 1.04;
        }
    }

    get_range_attack() { return this.range_attack; }
    get_mage_attack() { return this.mage_attack; }
    get_range_defence() { return this.range_defence; }
    get_mage_defence() { return this.mage_defence; }
    get_range_strength_multiplier() { return this.range_strength_multiplier; }
    get_mage_damage_multiplier() { return this.mage_damage_multiplier; }
}

class Player {
    constructor(mage_lvl = 99, range_lvl = 99, hp = 99,
                defence_lvl = 99, armor_tier = 1, starting_food = 24,
                player_range_prayer_name_cfg = "RIGOUR", player_mage_prayer_name_cfg = "AUGURY") {

        this._mage_lvl = mage_lvl;
        this._range_lvl = range_lvl;
        this._hp = hp;
        this._max_hp = hp;
        this._defence_lvl = defence_lvl;

        // Store prayer names for max hit calculation
        this._player_range_prayer_name_for_calc = player_range_prayer_name_cfg;
        this._player_mage_prayer_name_for_calc = player_mage_prayer_name_cfg;


        if (armor_tier === 1) {
            this._gear_mage_defence = 166;
            this._gear_range_defence = 166;
            this._gear_mage_attack = 16;
            this._gear_range_attack = 16;
        } else if (armor_tier === 2) {
            this._gear_mage_defence = 224;
            this._gear_range_defence = 224;
            this._gear_mage_attack = 28;
            this._gear_range_attack = 28;
        } else if (armor_tier === 3) {
            this._gear_mage_defence = 284;
            this._gear_range_defence = 284;
            this._gear_mage_attack = 40;
            this._gear_range_attack = 40;
        }


        this._gear_range_attack += 172; // Base weapon/gear accuracy bonus
        this._gear_mage_attack += 184;
        
        this._equipment_ranged_strength_bonus = 138;
        this._equipment_magic_damage_percentage = 0.29;

        this._calculated_range_max_hit = 0;
        this._calculated_mage_max_hit = 0;
        this._calculate_and_set_max_hits();


        this._tick_efficiency = 0.4; 
        this.damage_taken = 0;

        this._range_attack_cooldown = 3;
        this._mage_attack_cooldown = 3;
        this._ticks_since_attack = 4;
        
        this._remaining_food = starting_food;
        // Initial prayer set to a default, will be changed by sim logic
        this._prayer = new Prayer(this._player_range_prayer_name_for_calc); 
    }

    _calculate_and_set_max_hits() {
        const range_prayer_for_calc = new Prayer(this._player_range_prayer_name_for_calc);
        const prayer_strength_multiplier = range_prayer_for_calc.get_range_strength_multiplier();
        const effective_ranged_strength = Math.floor(this._range_lvl * prayer_strength_multiplier) + 8;
        this._calculated_range_max_hit = Math.floor(0.5 + (effective_ranged_strength * (this._equipment_ranged_strength_bonus + 64)) / 640);
        const mage_prayer_for_calc = new Prayer(this._player_mage_prayer_name_for_calc);
        const magic_damage_prayer_multiplier = mage_prayer_for_calc.get_mage_damage_multiplier(); // Usually 1.0

        if (magic_damage_prayer_multiplier != 1.0) {
            this._calculated_mage_max_hit = 40;
        } else {
            this._calculated_mage_max_hit = 39;
        }
    }

    get_mage_lvl() { return this._mage_lvl; }
    set_mage_lvl(val) { this._mage_lvl = val; }
    get_range_lvl() { return this._range_lvl; }
    set_range_lvl(val) { this._range_lvl = val; }
    get_hp() { return this._hp; }
    set_hp(val) { this._hp = val; }
    get_defence_lvl() { return this._defence_lvl; }
    set_defence_lvl(val) { this._defence_lvl = val; }
    get_gear_mage_defence() { return this._gear_mage_defence; }
    set_gear_mage_defence(val) { this._gear_mage_defence = val; }
    get_gear_range_defence() { return this._gear_range_defence; }
    set_gear_range_defence(val) { this._gear_range_defence = val; }
    get_gear_mage_attack() { return this._gear_mage_attack; }
    set_gear_mage_attack(val) { this._gear_mage_attack = val; }
    get_gear_range_attack() { return this._gear_range_attack; }
    set_gear_range_attack(val) { this._gear_range_attack = val; }
    
    get_range_max_hit() { return this._calculated_range_max_hit; }
    // set_range_max_hit no longer needed as it's calculated
    get_mage_max_hit() { return this._calculated_mage_max_hit; }
    // set_mage_max_hit no longer needed as it's calculated

    get_prayer() { return this._prayer; }
    set_prayer(val) { this._prayer = val; }
    get_tick_efficiency() { return this._tick_efficiency; }
    set_tick_efficiency(val) { this._tick_efficiency = val; }
    get_range_attack_cooldown() { return this._range_attack_cooldown; }
    set_range_attack_cooldown(val) { this._range_attack_cooldown = val; }
    get_mage_attack_cooldown() { return this._mage_attack_cooldown; }
    set_mage_attack_cooldown(val) { this._mage_attack_cooldown = val; }
    get_ticks_since_attack() { return this._ticks_since_attack; }
    set_ticks_since_attack(val) { this._ticks_since_attack = val; }
    get_remaining_food() { return this._remaining_food; }
    set_remaining_food(val) { this._remaining_food = val; }

    heal(heal_amount) {
        if ((this._hp + heal_amount) >= this._max_hp) {
            this._hp = this._max_hp;
            return;
        }
        this._hp += heal_amount;
    }

    damage(damage_amount) {
        this._hp -= damage_amount;
        this.damage_taken += damage_amount;
    }
}

class CorruptedHunllef {
    constructor(armor_tier = 1) {
        this._mage_lvl = 240;
        this._range_lvl = 240;
        this._hp = 1000;
        this._defence_lvl = 240;
        this._gear_mage_defence = 20;
        this._gear_range_defence = 20;
        this._gear_mage_attack = 90;
        this._gear_range_attack = 90;
        this._ticks_since_attack = 5;
        this._attack_cooldown = 4;
        this._attacks_fired = 0;
        this._attacks_taken = 0;
        this._current_prayer = "RANGE";
        this._current_attack_style = "RANGE";

        if (armor_tier === 1) {
            this._max_hit = 13;
        } else if (armor_tier === 2) {
            this._max_hit = 10;
        } else if (armor_tier === 3) {
            this._max_hit = 8;
        }
    }

    get_mage_lvl() { return this._mage_lvl; }
    get_range_lvl() { return this._range_lvl; }
    get_hp() { return this._hp; }
    set_hp(val) { this._hp = val; }
    get_defence_lvl() { return this._defence_lvl; }
    get_gear_mage_defence() { return this._gear_mage_defence; }
    get_gear_range_defence() { return this._gear_range_defence; }
    get_gear_mage_attack() { return this._gear_mage_attack; }
    get_gear_range_attack() { return this._gear_range_attack; }
    get_max_hit() { return this._max_hit; }
    get_ticks_since_attack() { return this._ticks_since_attack; }
    set_ticks_since_attack(val) { this._ticks_since_attack = val; }
    get_attack_cooldown() { return this._attack_cooldown; }
    get_attacks_fired() { return this._attacks_fired; }
    set_attacks_fired(val) { this._attacks_fired = val; }
    get_attacks_taken() { return this._attacks_taken; }
    set_attacks_taken(val) { this._attacks_taken = val; }
    get_current_prayer() { return this._current_prayer; }
    set_current_prayer(val) { this._current_prayer = val; }
    get_current_attack_style() { return this._current_attack_style; }
    set_current_attack_style(val) { this._current_attack_style = val; }

    swap_current_prayer() {
        this._current_prayer = (this._current_prayer === "RANGE") ? "MAGE" : "RANGE";
    }

    swap_current_attack_style() {
        this._current_attack_style = (this._current_attack_style === "RANGE") ? "MAGE" : "RANGE";
    }

    damage(damage_amount) {
        this._hp -= damage_amount;
    }
}

class CombatUtils {
    _roll(hit_chance) {
        return Math.random() < hit_chance;
    }

    _calculate_hit_chance(attack_roll_max, defence_roll_max) {
        let hit_chance;
        if (attack_roll_max > defence_roll_max) {
            hit_chance = (defence_roll_max + 2) / (2 * (attack_roll_max + 1));
            hit_chance = 1.0 - hit_chance;
        } else {
            hit_chance = attack_roll_max / (2 * (defence_roll_max + 1));
        }
        return hit_chance;
    }

    get_player_mage_attack_roll_max(mage_lvl, prayer_mage_attack_bonus, gear_mage_attack) {
        const effective_attack_level = Math.floor((mage_lvl * prayer_mage_attack_bonus) + 8 + 3);
        const attack_roll_max = Math.floor(effective_attack_level * (gear_mage_attack + 64));
        return attack_roll_max;
    }

    get_player_range_attack_roll_max(range_lvl, prayer_range_attack_bonus, gear_range_attack) {
        const effective_attack_level = Math.floor((range_lvl * prayer_range_attack_bonus) + 8);
        const attack_roll_max = Math.floor(effective_attack_level * (gear_range_attack + 64));
        return attack_roll_max;
    }

    get_hunllef_mage_defence_roll_max(hunllef_mage_lvl, hunllef_gear_mage_defence) {
        const effective_defence_level = hunllef_mage_lvl + 9;
        const defence_roll_max = Math.floor(effective_defence_level * (hunllef_gear_mage_defence + 64));
        return defence_roll_max;
    }

    get_hunllef_range_defence_roll_max(hunllef_defence_lvl, hunllef_gear_range_defence) {
        const effective_defence_level = hunllef_defence_lvl + 9;
        const defence_roll_max = Math.floor(effective_defence_level * (hunllef_gear_range_defence + 64));
        return defence_roll_max;
    }

    check_player_mage_hit(player, hunllef) {
        const effective_attack_level_player = Math.floor(
            (player.get_mage_lvl() * player.get_prayer().get_mage_attack()) + 8 + 3
        );
        const attack_roll_max_player = Math.floor(
            effective_attack_level_player * (player.get_gear_mage_attack() + 64)
        );

        const effective_defence_level_hunllef = hunllef.get_mage_lvl() + 9;
        const defence_roll_max_hunllef = Math.floor(
            effective_defence_level_hunllef * (hunllef.get_gear_mage_defence() + 64)
        );

        const hit_chance = this._calculate_hit_chance(attack_roll_max_player, defence_roll_max_hunllef);
        return this._roll(hit_chance);
    }

    check_player_range_hit(player, hunllef) {
        const effective_attack_level_player = Math.floor(
            (player.get_range_lvl() * player.get_prayer().get_range_attack()) + 8
        );
        const attack_roll_max_player = Math.floor(
            effective_attack_level_player * (player.get_gear_range_attack() + 64)
        );

        const effective_defence_level_hunllef = hunllef.get_defence_lvl() + 9;
        const defence_roll_max_hunllef = Math.floor(
            effective_defence_level_hunllef * (hunllef.get_gear_range_defence() + 64)
        );
        
        const hit_chance = this._calculate_hit_chance(attack_roll_max_player, defence_roll_max_hunllef);
        return this._roll(hit_chance);
    }

    check_monster_range_hit(player, hunllef) {
        const effective_attack_level = hunllef.get_range_lvl() + 9;
        const attack_roll_max = Math.floor(effective_attack_level * (hunllef.get_gear_range_attack() + 64));
        
        const effective_defence_level = Math.floor(
            (player.get_defence_lvl() * player.get_prayer().get_range_defence()) + 9
        );
        const defence_roll_max = Math.floor(
            effective_defence_level * (player.get_gear_range_defence() + 64)
        );
        
        const hit_chance = this._calculate_hit_chance(attack_roll_max, defence_roll_max);
        return this._roll(hit_chance);
    }

    check_monster_mage_hit(player, hunllef) {
        const effective_attack_level = hunllef.get_mage_lvl() + 9;
        const attack_roll_max = Math.floor(effective_attack_level * (hunllef.get_gear_mage_attack() + 64));

        const effective_defence_level = Math.floor(
            ((player.get_mage_lvl() * 0.7) + (player.get_defence_lvl() * 0.3)) * player.get_prayer().get_mage_defence() + 8
        );
        const defence_roll_max = Math.floor(effective_defence_level * (player.get_gear_mage_defence() + 64));

        const hit_chance = this._calculate_hit_chance(attack_roll_max, defence_roll_max);
        return this._roll(hit_chance);
    }
}

class HunllefSimulatorLogic {
    constructor(range_prayer_name, mage_prayer_name) {
        this.food_heal = 22;
        this.eat_threshold = 14;
        this.combat_utils = new CombatUtils();
        this.random_range = new RandomRange();
        this.player_range_prayer_name = range_prayer_name;
        this.player_mage_prayer_name = mage_prayer_name;
    }

    tick(player, hunllef) {
        this.player_tick(player, hunllef);
        this.hunllef_tick(player, hunllef);
    }

    player_tick(player, hunllef) {
        if (this.random_range.random_double() > player.get_tick_efficiency()) {
            if (this.should_eat(player) && this.has_food(player)) {
                player.set_remaining_food(player.get_remaining_food() - 1);
                player.heal(this.food_heal);
                player.set_ticks_since_attack(player.get_ticks_since_attack() - 3); // Eating costs ticks
            } else if (player.get_ticks_since_attack() >= 3) { // Assuming 4-tick weapons
                player.set_ticks_since_attack(0);
                hunllef.set_attacks_taken(hunllef.get_attacks_taken() + 1);

                if (hunllef.get_current_prayer() === "MAGE") {
                    player.set_prayer(new Prayer(this.player_range_prayer_name));
                    if (this.combat_utils.check_player_range_hit(player, hunllef)) {
                        hunllef.damage(this.random_range.random_player_damage(player.get_range_max_hit()));
                    }
                } else { // Hunllef prayer is RANGE
                    player.set_prayer(new Prayer(this.player_mage_prayer_name));
                    if (this.combat_utils.check_player_mage_hit(player, hunllef)) {
                        hunllef.damage(this.random_range.random_player_damage(player.get_mage_max_hit()));
                    }
                }
            } else {
                player.set_ticks_since_attack(player.get_ticks_since_attack() + 1);
            }
        } else { // Tick wasted
            player.set_ticks_since_attack(player.get_ticks_since_attack() + 1);
        }
    }

    should_eat(player) {
        return player.get_hp() <= this.eat_threshold;
    }

    has_food(player) {
        return player.get_remaining_food() > 0;
    }

    hunllef_tick(player, hunllef) {
        if (hunllef.get_attacks_fired() === 4) {
            hunllef.swap_current_attack_style();
            hunllef.set_attacks_fired(0);
        }

        // Hunllef prayer swap logic based on player attacks taken by Hunllef
        if (hunllef.get_attacks_taken() === 6) {
            hunllef.swap_current_prayer();
            hunllef.set_attacks_taken(0);
        }

        if (hunllef.get_ticks_since_attack() >= hunllef.get_attack_cooldown()) {
            hunllef.set_ticks_since_attack(0);
            hunllef.set_attacks_fired(hunllef.get_attacks_fired() + 1);
            
            const damage_to_deal = this.random_range.random_int(hunllef.get_max_hit());

            if (hunllef.get_current_attack_style() === "RANGE") {
                 player.set_prayer(new Prayer(this.player_range_prayer_name)); // Player uses defensive prayer against range
                if (this.combat_utils.check_monster_range_hit(player, hunllef)) {
                    player.damage(damage_to_deal);
                } else {
                    player.damage(0); 
                }
            } else { // Hunllef attack style is MAGE
                player.set_prayer(new Prayer(this.player_mage_prayer_name)); // Player uses defensive prayer against mage
                if (this.combat_utils.check_monster_mage_hit(player, hunllef)) {
                    player.damage(damage_to_deal);
                } else {
                     player.damage(0); 
                }
            }
        } else {
            hunllef.set_ticks_since_attack(hunllef.get_ticks_since_attack() + 1);
        }
    }
}

function run_simulation_and_get_output(
    iterations_count,
    p_mage_lvl,
    p_range_lvl,
    p_hp,
    p_defence_lvl,
    p_tick_efficiency,
    p_range_prayer_name,
    p_mage_prayer_name,
    p_armor_tier,
    p_starting_food
) {
    let output_lines = [];

    // Display calculated max hits once based on initial settings
    const tempPlayerForDisplay = new Player(
        p_mage_lvl, p_range_lvl, p_hp, p_defence_lvl, 
        p_armor_tier, p_starting_food, 
        p_range_prayer_name, p_mage_prayer_name
    );


    let total_ticks_sum = 0;
    let total_damage_player_taken_sum = 0;
    let total_food_remaining_sum = 0;
    let deaths = 0;
    let successful_kills = 0;

    for (let i = 0; i < iterations_count; i++) {
        let done = false;
        let player = new Player(
            p_mage_lvl,
            p_range_lvl,
            p_hp,
            p_defence_lvl,
            p_armor_tier,
            p_starting_food,
            p_range_prayer_name,
            p_mage_prayer_name
        );
        player.set_tick_efficiency(p_tick_efficiency);

        let hunllef = new CorruptedHunllef(p_armor_tier);
        let hunllef_sim_logic = new HunllefSimulatorLogic(
            p_range_prayer_name,
            p_mage_prayer_name
        );
        let ticks_this_iteration = 0;
        const MAX_TICKS_PER_FIGHT = 2000; 

        while (!done && ticks_this_iteration < MAX_TICKS_PER_FIGHT) {
            ticks_this_iteration++;
            hunllef_sim_logic.tick(player, hunllef);
            if (player.get_hp() <= 0 || hunllef.get_hp() <= 0) {
                done = true;
            }
        }
        
        if (player.get_hp() <= 0) {
            deaths++;
            total_damage_player_taken_sum += player.damage_taken;
            total_food_remaining_sum += player.get_remaining_food();
        } else if (hunllef.get_hp() <= 0) {
            successful_kills++;
            total_ticks_sum += ticks_this_iteration; 
            total_damage_player_taken_sum += player.damage_taken;
            total_food_remaining_sum += player.get_remaining_food();
        } else {
            deaths++; 
        }
    }

    let average_time_taken_ticks = 0;
    let average_damage_taken = 0;
    let average_food_remaining = 0;
    let death_percentage = 0;
    let success_percentage = 0;

    if (iterations_count > 0) {
        death_percentage = (deaths / iterations_count) * 100;
        success_percentage = (successful_kills / iterations_count) * 100;
        if (successful_kills > 0) {
            average_time_taken_ticks = total_ticks_sum / successful_kills;
            average_damage_taken = total_damage_player_taken_sum / successful_kills;
            average_food_remaining = total_food_remaining_sum / successful_kills;
        }
    }

    output_lines.push(`--- Simulation Summary (Based on ${iterations_count} iterations) ---`);
    output_lines.push(`Successful Kills: ${successful_kills} (${success_percentage.toFixed(2)}%)`);
    output_lines.push(`Deaths:  ${deaths} (${death_percentage.toFixed(2)}%)`);
    
    if (successful_kills > 0) {
        output_lines.push(`\n--- Statistics ---`);
        output_lines.push(`Average Damage Taken:  ${average_damage_taken.toFixed(2)}`);
        output_lines.push(`Average Food Remaining:  ${average_food_remaining.toFixed(2)}`);

        const total_seconds = Math.floor(average_time_taken_ticks * 0.6);
        const minutes = Math.floor(total_seconds / 60);
        const seconds = total_seconds % 60;
        output_lines.push(`Average Fight Duration:  ${minutes}m ${seconds}s (${average_time_taken_ticks.toFixed(2)} ticks)`);
    } else {
        output_lines.push(`\nNo successful kills to calculate averages from.`);
    }
    
    return output_lines.join('\n');
}


document.getElementById('runButton').addEventListener('click', function() {
    const resultsDiv = document.getElementById('results');
    const loader = document.getElementById('loader');
    resultsDiv.textContent = 'Running simulation... please wait.';
    loader.style.display = 'inline-block'; 

    this.disabled = true; 

    const iterations = parseInt(document.getElementById('iterations').value);
    const player_mage_lvl = parseInt(document.getElementById('player_mage_lvl').value);
    const player_range_lvl = parseInt(document.getElementById('player_range_lvl').value);
    const player_hp = parseInt(document.getElementById('player_hp').value);
    const player_defence_lvl = parseInt(document.getElementById('player_defence_lvl').value);
    let player_tick_efficiency = parseFloat(document.getElementById('player_tick_efficiency').value);
    player_tick_efficiency = player_tick_efficiency / 100; 

    const player_range_prayer = document.getElementById('player_range_prayer').value;
    const player_mage_prayer = document.getElementById('player_mage_prayer').value;
    const player_armor_tier = parseInt(document.getElementById('player_armor_tier').value);
    const player_starting_food = parseInt(document.getElementById('player_starting_food').value);

    setTimeout(() => {
        try {
            const output = run_simulation_and_get_output(
                iterations,
                player_mage_lvl,
                player_range_lvl,
                player_hp,
                player_defence_lvl,
                player_tick_efficiency,
                player_range_prayer,
                player_mage_prayer,
                player_armor_tier,
                player_starting_food
            );
            resultsDiv.textContent = output;
        } catch (error) {
            resultsDiv.textContent = 'Error running simulation: \n' + error + "\n\nStack Trace:\n" + error.stack;
            console.error(error);
        } finally {
            loader.style.display = 'none';
            document.getElementById('runButton').disabled = false; 
        }
    }, 50); 
});
