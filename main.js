// 拆除返还比例：临时为 0，正式比例等待用户确认。
const DEMOLISH_REFUND_RATE = 0;
const DEMOLISH_DRAG_THRESHOLD = 8;
const ENERGY_CAP_UPGRADE_COST = 10;
const ENERGY_CAP_UPGRADE_AMOUNT = 10;
const ENERGY_CAP_MAX = 100;
const CARD_DRAG_THRESHOLD = 10;

const BUILDING_VISUALS = {
  collector: { texture: "building_harvester", scale: 0.12 },
  turret: { texture: "building_turret", scale: 0.12 },
  laser: { texture: "building_prism", scale: 0.12 },
  shield: { texture: "building_gravity_shield", scale: 0.105 }
};

const ENEMY_VISUALS = {
  basic: { texture: "enemy_basic", scale: 0.075 },
  fast: { texture: "enemy_fast", scale: 0.07 },
  tank: { texture: "enemy_tank", scale: 0.085 },
  shieldbreaker: { texture: "enemy_shieldbreaker", scale: 0.08 },
  leaper: { texture: "enemy_leaper", scale: 0.075 },
  ranged: { texture: "enemy_ranged", scale: 0.075 }
};

const GAME_ASSET_PATHS = {
  building_harvester: "assets/game/buildings/building_harvester.png",
  building_turret: "assets/game/buildings/building_turret.png",
  building_prism: "assets/game/buildings/building_prism.png",
  building_gravity_shield: "assets/game/buildings/building_gravity_shield.png",
  enemy_basic: "assets/game/enemies/enemy_basic.png",
  enemy_fast: "assets/game/enemies/enemy_fast.png",
  enemy_tank: "assets/game/enemies/enemy_tank.png",
  enemy_shieldbreaker: "assets/game/enemies/enemy_shieldbreaker.png",
  enemy_ranged: "assets/game/enemies/enemy_ranged.png",
  icon_star_energy: "assets/game/ui/icon_star_energy.png",
  icon_planet_hp: "assets/game/ui/icon_planet_hp.png",
  icon_wave: "assets/game/ui/icon_wave.png",
  icon_meteor_strike: "assets/game/ui/icon_meteor_strike.png",
  icon_demolish: "assets/game/ui/icon_demolish.png",
  icon_energy_upgrade: "assets/game/ui/icon_energy_upgrade.png",
  bg_space_battlefield: "assets/game/backgrounds/bg_space_battlefield.png",
  tile_defense_grid: "assets/game/tiles/tile_defense_grid.png"
};

class SceneDemo extends Phaser.Scene {
  constructor() {
    super("SceneDemo");
  }

  makeText(x, y, content, style = {}) {
    const text = this.add.text(x, y, content, {
      fontFamily: '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, sans-serif',
      color: "#ffffff",
      fontSize: "18px",
      ...style
    });

    text.setPadding(0, 8, 0, 8);
    text.setResolution(Math.min(window.devicePixelRatio || 1, 2));

    return text;
  }

  addToFrontline(item) {
    this.frontlineLayer.add(item);
    return item;
  }

  makeFrontlineText(x, y, content, style = {}) {
    return this.addToFrontline(this.makeText(x, y, content, style));
  }

  preload() {
    for (const [key, path] of Object.entries(GAME_ASSET_PATHS)) {
      this.load.image(key, path);
    }
  }

  hasTexture(key) {
    return Boolean(this.textures?.exists?.(key));
  }

  create() {
    this.cameras.main.setRoundPixels(true);

    this.W = this.scale.width;
    this.H = this.scale.height;

    // 星能系统
    this.starEnergy = 10;
    this.maxStarEnergy = 50;
    this.energyRegen = 0; // 取消自然恢复，星能主要来自采集器和击杀返还。

    this.planetHp = 100;
    this.selectedCard = null;

    this.gridCells = [];
    this.shieldSlots = [];
    this.cards = [];
    this.buildings = [];
    this.shields = [];
    this.enemies = [];
    this.projectiles = [];
    this.storedCollectors = [];
    this.gameState = "playing";
    this.frontlineTransitioning = false;
    this.demolishMode = false;
    this.pendingDemolishTarget = null;
    this.pendingPlacementTarget = null;
    this.pendingMeteorCast = null;
    this.pointerPressStart = null;
    this.pointerDragging = false;
    this.fixedUiPointerActive = false;
    this.pointerIsTouch = false;
    this.battlefieldPanStartX = 0;
    this.cardDragState = { active: false, candidateCard: null, card: null, startX: 0, startY: 0, ghost: null, outline: null, valid: false };

    // 星尘采集器等级配置：数值集中在这里，后面调节经济节奏更方便。
    this.collectorMaxLevel = 5;
    this.collectorLevels = {
      1: { amount: 1, interval: 8, color: 0x22c55e, textColor: "#86efac" },
      2: { amount: 2, interval: 7, color: 0x14b8a6, textColor: "#67e8f9" },
      3: { amount: 3, interval: 6, color: 0xfacc15, textColor: "#fde68a" },
      4: { amount: 4, interval: 5.5, color: 0xf97316, textColor: "#fed7aa" },
      5: { amount: 5, interval: 5, color: 0xe879f9, textColor: "#f5d0fe" }
    };
    this.collectorUpgradeCosts = {
      1: 6,
      2: 8,
      3: 10,
      4: 12
    };

    // 防御建筑等级配置：炮台和光棱都先做 3 级，后续可继续补分支特性。
    this.defenseMaxLevel = 3;
    this.defenseLevels = {
      turret: {
        1: { damage: 4, cooldown: 0.95, range: 250, color: 0x38bdf8, textColor: "#bae6fd" },
        2: { damage: 6, cooldown: 0.82, range: 285, color: 0x0ea5e9, textColor: "#7dd3fc" },
        3: { damage: 8, cooldown: 0.72, range: 320, color: 0x60a5fa, textColor: "#dbeafe" }
      },
      laser: {
        1: { damage: 9, cooldown: 1.45, range: 560, color: 0xfacc15, textColor: "#fde68a" },
        2: { damage: 13, cooldown: 1.3, range: 600, color: 0xf97316, textColor: "#fed7aa" },
        3: { damage: 17, cooldown: 1.15, range: 640, color: 0xfef3c7, textColor: "#fef9c3" }
      }
    };
    this.defenseUpgradeCosts = {
      turret: { 1: 4, 2: 6 },
      laser: { 1: 7, 2: 10 }
    };
    this.shieldMaxLevel = 3;
    this.shieldLevels = {
      1: { color: 0x93c5fd, textColor: "#dbeafe" },
      2: { color: 0x38bdf8, textColor: "#bae6fd" },
      3: { color: 0xfacc15, textColor: "#fde68a" }
    };
    this.shieldUpgradeCosts = {
      1: 5,
      2: 7
    };

    // 建筑与护盾耐久集中配置；当前均为临时测试值，等待后续平衡阶段调整。
    this.durabilityConfig = {
      building: {
        collector: { maxHp: 40, collisionHalfWidth: 22 },
        turret: { maxHp: 60, collisionHalfWidth: 22 },
        laser: { maxHp: 50, collisionHalfWidth: 22 }
      },
      shield: {
        1: { maxHp: 24 },
        2: { maxHp: 36 },
        3: { maxHp: 50 }
      },
      healthBar: {
        buildingWidth: 42,
        shieldWidth: 34,
        height: 5,
        buildingOffsetY: -31,
        shieldOffsetY: -38
      }
    };

    // 敌人攻击间隔独立于帧率；单次伤害继续沿用当前波次配置。
    this.enemyCombatConfig = {
      attackInterval: 1
    };

    this.meteorRange = 130;
    this.meteorDamage = 18;
    this.meteorPreviewOuter = null;
    this.meteorPreviewInner = null;

    // 无尽波次：每 10 波切换一次左右战区，敌人血量随波次持续叠加。
    this.currentWaveIndex = 0;
    this.waveSpawned = 0;
    this.waveActive = false;
    this.waveStartTimer = 2.5;
    this.waveSpawnTimer = 0;
    this.waveRestTime = 4;
    this.wavesPerFrontline = 10;
    this.frontlineIndex = 1;
    this.enemyDirection = -1;
    this.waveTemplates = [
      { count: 3, interval: 2.8, hp: 14, speed: 40, damage: 10, reward: 1 },
      { count: 4, interval: 2.7, hp: 16, speed: 41, damage: 10, reward: 1 },
      { count: 4, interval: 2.6, hp: 19, speed: 42, damage: 11, reward: 1 },
      { count: 5, interval: 2.5, hp: 22, speed: 43, damage: 11, reward: 1 },
      { count: 5, interval: 2.4, hp: 25, speed: 44, damage: 12, reward: 1 },
      { count: 6, interval: 2.3, hp: 29, speed: 45, damage: 12, reward: 1 },
      { count: 6, interval: 2.2, hp: 33, speed: 46, damage: 13, reward: 2 },
      { count: 7, interval: 2.1, hp: 37, speed: 48, damage: 13, reward: 2 },
      { count: 7, interval: 2.0, hp: 42, speed: 49, damage: 14, reward: 2 },
      { count: 8, interval: 1.9, hp: 48, speed: 50, damage: 14, reward: 2 }
    ];

    this.createBackground();
    this.createTitle();
    // 战场层单独移动，换边时 UI 和卡牌区保持稳定。
    this.frontlineLayer = this.add.container(0, 0);
    this.createPlanet();
    this.createPortal();
    this.createBattlefield();
    this.createCards();
    this.createUI();
    this.createMeteorPreview();

    this.input.on("pointermove", (pointer) => {
      this.updateCardDragGhost(pointer);
      this.trackPointerMovement(pointer);
      this.updateMeteorPreview(pointer);
    });

    this.input.on("pointerdown", (pointer) => {
      this.beginPointerInteraction(pointer);
      this.handleGlobalClick(pointer);
    });

    this.input.on("pointerup", (pointer) => {
      this.finishPointerInteraction(pointer);
    });
    this.input.on("pointercancel", () => this.cancelCardDrag());
  }

  update(time, delta) {
    const dt = delta / 1000;

    if (this.gameState !== "playing") return;

    this.updateCollectors(dt);

    if (this.frontlineTransitioning) return;

    this.updateWaves(dt);
    this.updateBuildingAttacks(dt);
    this.updateEnemyAttacks(dt);
    this.updateEnemies(dt);
    this.updateProjectiles(dt);
  }

  createBackground() {
    const W = this.W;
    const H = this.H;

    this.add.rectangle(W / 2, H / 2, W, H, 0x030712);

    if (this.hasTexture("bg_space_battlefield")) {
      const background = this.add.image(W / 2, H / 2 - 25, "bg_space_battlefield");
      background.setScale(1.35);
      background.setAlpha(0.72);
      background.setDepth(-10);
    }

    this.add.circle(880, 240, 280, 0x1e1b4b, 0.16);
    this.add.circle(980, 500, 330, 0x312e81, 0.10);
    this.add.circle(430, 240, 260, 0x0f172a, 0.45);
    this.add.circle(640, 620, 420, 0x020617, 0.45);

    for (let i = 0; i < 150; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H - 120);
      const r = Phaser.Math.FloatBetween(0.6, 1.8);
      const a = Phaser.Math.FloatBetween(0.18, 0.75);
      this.add.circle(x, y, r, 0xe5e7eb, a);
    }

    for (let i = 0; i < 16; i++) {
      const x = Phaser.Math.Between(40, W - 40);
      const y = Phaser.Math.Between(40, H - 150);

      this.add.circle(x, y, 2.2, 0xffffff, 0.85);
      this.add.circle(x, y, 6, 0x93c5fd, 0.08);
    }

    this.add.rectangle(W / 2, 0, W, 130, 0x000000, 0.18);
    this.add.rectangle(W / 2, H - 60, W, 150, 0x000000, 0.25);
    this.add.rectangle(0, H / 2, 180, H, 0x000000, 0.20);
    this.add.rectangle(W, H / 2, 180, H, 0x000000, 0.20);
  }

  createTitle() {
    this.titleText = this.makeText(24, 8, "星辰寂灭：虚空防线", {
      fontSize: "24px",
      color: "#e5f2ff",
      fontStyle: "bold",
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: "#38bdf8",
        blur: 8,
        fill: true
      }
    });
    this.titleText.setDepth(91);

    this.subtitleText = this.makeText(26, 45, "Voidfall: Stellar Defense", {
      fontSize: "13px",
      color: "#8aa4bd"
    });
    this.subtitleText.setDepth(91);
  }

  createPlanet() {
    this.planetX = 125;
    this.planetY = this.H / 2 - 44;
    this.planetVisuals = [];
    const keepPlanet = (item) => {
      this.frontlineLayer.add(item);
      this.planetVisuals.push(item);
      return item;
    };

    const planetGlow1 = keepPlanet(this.add.circle(this.planetX, this.planetY, 95, 0x1d4ed8, 0.10));
    const planetGlow2 = keepPlanet(this.add.circle(this.planetX, this.planetY, 72, 0x60a5fa, 0.12));

    keepPlanet(this.add.circle(this.planetX, this.planetY, 58, 0x0f3b82, 1));
    keepPlanet(this.add.circle(this.planetX - 8, this.planetY - 8, 52, 0x2563eb, 0.95));
    keepPlanet(this.add.circle(this.planetX - 20, this.planetY - 20, 30, 0x60a5fa, 0.30));
    keepPlanet(this.add.circle(this.planetX + 18, this.planetY + 18, 50, 0x020617, 0.20));

    const planetEdge = keepPlanet(this.add.circle(this.planetX, this.planetY, 60, 0x000000, 0));
    planetEdge.setStrokeStyle(4, 0xbfdbfe, 0.95);

    const orbit1 = keepPlanet(this.add.ellipse(this.planetX, this.planetY, 160, 116));
    orbit1.setStrokeStyle(1, 0x93c5fd, 0.18);

    const orbit2 = keepPlanet(this.add.ellipse(this.planetX, this.planetY, 195, 140));
    orbit2.setStrokeStyle(1, 0x38bdf8, 0.10);

    keepPlanet(this.makeText(this.planetX - 34, this.planetY + 76, "晨曦星", {
      fontSize: "18px",
      color: "#cfe8ff",
      fontStyle: "bold"
    }));

    this.tweens.add({
      targets: [planetGlow1, planetGlow2],
      scale: 1.12,
      alpha: 0.22,
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
  }

  createPortal() {
    this.portalX = 1130;
    this.portalY = this.H / 2 - 44;
    this.portalVisuals = [];
    const keepPortal = (item) => {
      this.frontlineLayer.add(item);
      this.portalVisuals.push(item);
      return item;
    };

    const portalGlow = keepPortal(this.add.circle(this.portalX, this.portalY, 84, 0x7e22ce, 0.16));

    const portalOuter = keepPortal(this.add.circle(this.portalX, this.portalY, 54, 0x581c87, 0.85));
    portalOuter.setStrokeStyle(5, 0xc084fc, 0.95);

    const portalRing2 = keepPortal(this.add.circle(this.portalX, this.portalY, 40, 0x7e22ce, 0.32));
    portalRing2.setStrokeStyle(3, 0xf0abfc, 0.45);

    keepPortal(this.add.circle(this.portalX, this.portalY, 23, 0x07020f, 1));

    for (let i = 0; i < 22; i++) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(44, 78);
      const px = this.portalX + Math.cos(angle) * dist;
      const py = this.portalY + Math.sin(angle) * dist;

      const p = keepPortal(this.add.circle(px, py, Phaser.Math.FloatBetween(1.5, 3), 0xe879f9, 0.55));

      this.tweens.add({
        targets: p,
        alpha: 0.1,
        scale: 1.6,
        duration: Phaser.Math.Between(700, 1500),
        yoyo: true,
        repeat: -1
      });
    }

    keepPortal(this.makeText(this.portalX - 43, this.portalY + 72, "虚空裂隙", {
      fontSize: "18px",
      color: "#f3d5ff"
    }));

    this.tweens.add({
      targets: portalOuter,
      angle: 360,
      duration: 3200,
      repeat: -1
    });

    this.tweens.add({
      targets: portalRing2,
      scale: 1.12,
      alpha: 0.52,
      duration: 900,
      yoyo: true,
      repeat: -1
    });

    this.tweens.add({
      targets: portalGlow,
      scale: 1.16,
      alpha: 0.28,
      duration: 1400,
      yoyo: true,
      repeat: -1
    });
  }

  createBattlefield() {
    const keepField = (item) => this.addToFrontline(item);

    this.rows = 5;
    this.cols = 7;
    this.cellW = 95;
    this.cellH = 70;
    this.startX = 260;
    this.startY = 145;

    const fieldBg = keepField(this.add.rectangle(
      this.startX + (this.cols - 1) * this.cellW / 2,
      this.startY + (this.rows - 1) * this.cellH / 2,
      this.cols * this.cellW + 34,
      this.rows * this.cellH + 34,
      0x020617,
      0.34
    ));
    fieldBg.setStrokeStyle(1, 0x1e3a8a, 0.28);

    this.zoneLabels = {};

    this.zoneLabels.logistics = this.makeFrontlineText(this.startX, this.startY - 58, "资源区", {
      fontSize: "16px",
      color: "#38d7ff",
      fontStyle: "bold"
    });
    this.zoneLabels.logistics.setOrigin(0.5, 0);

    this.zoneLabels.defense = this.makeFrontlineText(this.startX + 3.5 * this.cellW, this.startY - 58, "防御区", {
      fontSize: "16px",
      color: "#cbd5e1",
      fontStyle: "bold"
    });
    this.zoneLabels.defense.setOrigin(0.5, 0);

    for (let row = 0; row < this.rows; row++) {
      this.gridCells[row] = [];

      for (let col = 0; col < this.cols; col++) {
        const x = this.startX + col * this.cellW;
        const y = this.startY + row * this.cellH;
        const isLogistics = col === this.getLogisticsColumn();

        keepField(this.add.rectangle(x + 3, y + 4, this.cellW - 10, this.cellH - 10, 0x000000, 0.25));

        if (this.hasTexture("tile_defense_grid") && !isLogistics) {
          const tile = keepField(this.add.image(x, y, "tile_defense_grid"));
          tile.setScale(0.13);
          tile.setAlpha(0.20);
        }

        const fill = isLogistics ? 0x073047 : 0x0b1220;
        const stroke = isLogistics ? 0x00d9ff : 0x48627f;

        const rect = keepField(this.add.rectangle(
          x,
          y,
          this.cellW - 10,
          this.cellH - 10,
          fill,
          isLogistics ? 0.82 : 0.72
        ));

        rect.setStrokeStyle(2, stroke, isLogistics ? 0.85 : 0.55);
        rect.setInteractive({ useHandCursor: true });

        const inner = keepField(this.add.rectangle(x, y, this.cellW - 20, this.cellH - 20, 0xffffff, 0));
        inner.setStrokeStyle(1, isLogistics ? 0x67e8f9 : 0x94a3b8, isLogistics ? 0.22 : 0.12);

        const logisticsMarkerCore = keepField(this.add.circle(x, y, 7, 0x22c55e, 0.95));
        const logisticsMarkerGlow = keepField(this.add.circle(x, y, 17, 0x22c55e, 0.08));
        logisticsMarkerCore.setVisible(isLogistics);
        logisticsMarkerGlow.setVisible(isLogistics);

        const cell = {
          row,
          col,
          x,
          y,
          frontlineId: this.frontlineIndex,
          type: isLogistics ? "logistics" : "defense",
          occupied: false,
          rect,
          inner,
          logisticsMarkerCore,
          logisticsMarkerGlow
        };

        this.gridCells[row][col] = cell;

        rect.on("pointerover", () => {
          this.hoverCell(cell, true);
        });

        rect.on("pointerout", () => {
          this.hoverCell(cell, false);
        });

        rect.on("pointerdown", (pointer) => {
          this.beginPointerInteraction(pointer);

          if (this.demolishMode) {
            this.queueDemolishTarget(cell.building || null);
            return;
          }

          this.queuePlacementTarget("cell", cell);
        });
      }
    }

    this.createShieldSlots();

    this.makeFrontlineText(
      this.startX + 95,
      this.startY + this.rows * this.cellH + 14,
      "蓝色细线 = 引力护盾可部署位置，最外层也可展开防线",
      {
        fontSize: "14px",
        color: "#7f98b2"
      }
    );

    this.directionArrows = [];

    for (let i = 0; i < 5; i++) {
      const arrow = this.makeFrontlineText(1000 - i * 130, this.H / 2 - 58, "←", {
        fontSize: "26px",
        color: "#fb7185",
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: "#fb7185",
          blur: 6,
          fill: true
        }
      });

      arrow.setAlpha(0.75);
      this.directionArrows.push(arrow);
    }

    this.directionLabel = this.makeFrontlineText(920, this.H / 2 - 105, "敌人进攻方向", {
      fontSize: "16px",
      color: "#fb7185"
    });

    this.updateBattlefieldOrientation();
    this.updateDirectionVisuals();
  }

  createShieldSlots() {
    for (let row = 0; row < this.rows; row++) {
      for (let edge = 0; edge <= this.cols; edge++) {
        const x = this.startX + (edge - 0.5) * this.cellW;
        const y = this.startY + row * this.cellH;

        const line = this.addToFrontline(this.add.rectangle(x, y, 5, this.cellH - 18, 0x60a5fa, 0.13));
        line.setStrokeStyle(1, 0x93c5fd, 0.25);

        const hitArea = this.addToFrontline(this.add.rectangle(x, y, 28, this.cellH - 10, 0xffffff, 0));
        hitArea.setInteractive({ useHandCursor: true });

        const slot = {
          row,
          edge,
          x,
          y,
          frontlineId: this.frontlineIndex,
          active: false,
          placed: false,
          line,
          hitArea
        };

        this.shieldSlots.push(slot);

        hitArea.on("pointerover", () => {
          if (!slot.active) return;

          if (this.demolishMode) {
            if (slot.placed && slot.shield?.frontlineId === this.frontlineIndex) {
              line.setFillStyle(0xfb7185, 0.58);
              line.setStrokeStyle(3, 0xfb7185, 1);
            }

            return;
          }

          if (!this.selectedCard || this.selectedCard.id !== "shield") return;

          if (!slot.placed) {
            line.setFillStyle(0x93c5fd, 0.45);
            return;
          }

          const canUpgrade = this.canUpgradeShield(slot.shield, false);
          line.setFillStyle(canUpgrade ? 0x22c55e : 0xef4444, 0.58);
          line.setStrokeStyle(3, canUpgrade ? 0x22c55e : 0xef4444, 1);
        });

        hitArea.on("pointerout", () => {
          if (!slot.active) return;

          if (slot.placed && slot.shield) {
            const config = this.shieldLevels[slot.shield.shieldLevel];
            line.setFillStyle(config.color, 0.78);
            line.setStrokeStyle(2, slot.shield.shieldLevel === this.shieldMaxLevel ? 0xfef3c7 : 0xdbeafe, 0.95);
          } else {
            line.setFillStyle(0x60a5fa, 0.13);
            line.setStrokeStyle(1, 0x93c5fd, 0.25);
          }
        });

        hitArea.on("pointerdown", (pointer) => {
          this.beginPointerInteraction(pointer);

          if (this.demolishMode) {
            this.queueDemolishTarget(slot.shield || null);
            return;
          }

          this.queuePlacementTarget("shield", slot);
        });
      }
    }
  }

  createCards() {
    this.add.rectangle(this.W / 2, this.H - 60, this.W, 120, 0x020617, 0.94);
    this.add.rectangle(this.W / 2, this.H - 120, this.W, 2, 0x334155, 0.85);
    this.add.rectangle(this.W / 2, this.H - 118, this.W, 1, 0x93c5fd, 0.18);

    this.cardData = [
      {
        id: "collector",
        name: "星尘采集器",
        cost: 5,
        desc: "部署/升级经济",
        type: "building",
        texture: "building_harvester"
      },
      {
        id: "turret",
        name: "星轨炮台",
        cost: 3,
        desc: "基础输出建筑",
        type: "building",
        texture: "building_turret"
      },
      {
        id: "laser",
        name: "光棱卫星",
        cost: 7,
        desc: "远程高伤建筑",
        type: "building",
        texture: "building_prism"
      },
      {
        id: "shield",
        name: "引力护盾",
        cost: 4,
        desc: "部署在两列之间",
        type: "shield",
        texture: "building_gravity_shield"
      },
      {
        id: "meteor",
        name: "陨星打击",
        cost: 5,
        desc: "自由范围轰炸",
        type: "spell",
        texture: "icon_meteor_strike"
      }
    ];

    for (let i = 0; i < this.cardData.length; i++) {
      const data = this.cardData[i];
      const x = 210 + i * 170;
      const y = this.H - 60;

      this.add.rectangle(x + 4, y + 5, 150, 88, 0x000000, 0.35);

      const bg = this.add.rectangle(x, y, 150, 88, 0x0b1220, 0.98);
      bg.setStrokeStyle(2, 0x475569, 0.9);
      bg.setInteractive({ useHandCursor: true });

      this.add.rectangle(x, y - 34, 142, 2, 0x38bdf8, 0.18);

      let thumbnail = null;
      if (this.hasTexture(data.texture)) {
        thumbnail = this.add.image(x + 45, y - 10, data.texture);
        thumbnail.setScale(data.id === "meteor" ? 0.075 : 0.07);
        thumbnail.setDepth(2);
      }

      const title = this.makeText(x - 58, y - 37, data.name, {
        fontSize: "15px",
        color: "#dbeafe",
        fontStyle: "bold"
      });

      const cost = this.makeText(x - 58, y + 16, `费用：${data.cost}`, {
        fontSize: "13px",
        color: "#facc15"
      });

      const desc = this.makeText(x - 58, y + 35, data.desc, {
        fontSize: "12px",
        color: "#7f98b2"
      });

      const card = {
        data,
        bg,
        title,
        cost,
        desc,
        thumbnail
      };

      this.cards.push(card);

      bg.on("pointerover", () => {
        if (this.selectedCard?.id !== data.id) {
          bg.setStrokeStyle(2, 0x93c5fd, 1);
        }
      });

      bg.on("pointerout", () => {
        if (this.selectedCard?.id !== data.id) {
          bg.setStrokeStyle(2, 0x475569, 0.9);
        }
      });

      bg.on("pointerdown", (pointer) => {
        this.beginCardDragCandidate(data, pointer);
      });
    }
  }

  createUI() {
    this.statusBarBg = this.add.rectangle(this.W / 2, 38, this.W, 76, 0x020617, 0.86);
    this.statusBarBg.setDepth(90);

    this.statusBarDivider = this.add.rectangle(this.W / 2, 76, this.W, 2, 0x334155, 0.9);
    this.statusBarDivider.setDepth(90);

    const statusIcons = [
      ["icon_star_energy", 296, 24],
      ["icon_planet_hp", 656, 24],
      ["icon_wave", 846, 24]
    ];
    for (const [texture, x, y] of statusIcons) {
      if (!this.hasTexture(texture)) continue;
      const icon = this.add.image(x, y, texture).setScale(0.08);
      icon.setDepth(91);
    }

    this.energyText = this.makeText(320, 10, "", {
      fontSize: "18px",
      color: "#facc15",
      fontStyle: "bold"
    });
    this.energyText.setDepth(91);

    this.hpText = this.makeText(680, 10, "", {
      fontSize: "18px",
      color: "#74f2a5",
      fontStyle: "bold"
    });
    this.hpText.setDepth(91);

    this.waveText = this.makeText(870, 10, "", {
      fontSize: "18px",
      color: "#cbd5e1",
      fontStyle: "bold"
    });
    this.waveText.setDepth(91);

    this.frontlineText = this.makeText(320, 43, "", {
      fontSize: "15px",
      color: "#93c5fd",
      fontStyle: "bold"
    });
    this.frontlineText.setDepth(91);

    this.createEnergyCapUpgradeButton();

    this.messageBg = this.add.rectangle(0, 0, 480, 34, 0x020617, 0.9);
    this.messageBg.setStrokeStyle(1, 0x475569, 0.85);

    this.messageText = this.makeText(0, -1, "", {
      fontSize: "15px",
      color: "#e5e7eb",
      fontStyle: "bold"
    });
    this.messageText.setOrigin(0.5, 0.5);

    this.messageContainer = this.add.container(1010, 59, [this.messageBg, this.messageText]);
    this.messageContainer.setDepth(94);
    this.messageContainer.setVisible(false);
    this.messageContainer.setActive(false);

    this.createDemolishButton();
    this.updateUI();
    this.showMessage("选择一张卡牌开始部署防线");
  }

  createEnergyCapUpgradeButton() {
    const x = 560;
    const y = 27;
    const bg = this.add.rectangle(x, y, 180, 40, 0x0c4a6e, 0.96);
    bg.setStrokeStyle(2, 0x38bdf8, 0.95);
    bg.setInteractive({ useHandCursor: true });
    bg.setDepth(92);

    if (this.hasTexture("icon_energy_upgrade")) {
      const icon = this.add.image(x - 72, y, "icon_energy_upgrade");
      icon.setScale(0.055);
      icon.setDepth(93);
    }

    const label = this.makeText(x, y - 1, "", {
      fontSize: "14px",
      color: "#e0f2fe",
      fontStyle: "bold"
    });
    label.setOrigin(0.5, 0.5);
    label.setDepth(93);

    this.energyCapUpgradeButton = { bg, label };

    bg.on("pointerover", () => {
      if (this.maxStarEnergy < ENERGY_CAP_MAX) {
        bg.setStrokeStyle(3, 0x7dd3fc, 1);
      }
    });

    bg.on("pointerout", () => {
      this.updateEnergyCapUpgradeButtonState();
    });

    bg.on("pointerdown", () => {
      this.beginFixedUiInteraction();
      this.buyEnergyCapUpgrade();
    });

    this.updateEnergyCapUpgradeButtonState();
  }

  buyEnergyCapUpgrade() {
    if (this.gameState !== "playing") {
      this.showMessage("本局已经结束，无法升级星能上限");
      return false;
    }

    if (this.maxStarEnergy >= ENERGY_CAP_MAX) {
      this.showMessage("星能上限已满");
      this.updateEnergyCapUpgradeButtonState();
      return false;
    }

    if (this.starEnergy < ENERGY_CAP_UPGRADE_COST) {
      this.showMessage("星能不足");
      return false;
    }

    this.starEnergy = Math.max(0, this.starEnergy - ENERGY_CAP_UPGRADE_COST);
    this.maxStarEnergy = Math.min(
      ENERGY_CAP_MAX,
      this.maxStarEnergy + ENERGY_CAP_UPGRADE_AMOUNT
    );

    this.updateUI();
    this.showMessage(`星能上限 +${ENERGY_CAP_UPGRADE_AMOUNT}`);
    return true;
  }

  updateEnergyCapUpgradeButtonState() {
    if (!this.energyCapUpgradeButton) return;

    const { bg, label } = this.energyCapUpgradeButton;
    const isFull = this.maxStarEnergy >= ENERGY_CAP_MAX;

    if (isFull) {
      bg.setFillStyle(0x111827, 0.72);
      bg.setStrokeStyle(2, 0x475569, 0.65);
      label.setText("上限已满");
      label.setColor("#94a3b8");
      return;
    }

    bg.setFillStyle(0x0c4a6e, 0.96);
    bg.setStrokeStyle(2, 0x38bdf8, 0.95);
    label.setText(`上限 +${ENERGY_CAP_UPGRADE_AMOUNT}  费用 ${ENERGY_CAP_UPGRADE_COST}`);
    label.setColor("#e0f2fe");
  }

  createDemolishButton() {
    const x = 1100;
    const y = this.H - 60;
    const bg = this.add.rectangle(x, y, 160, 88, 0x0b1220, 0.98);
    bg.setStrokeStyle(2, 0x64748b, 0.95);
    bg.setInteractive({ useHandCursor: true });
    bg.setDepth(90);

    if (this.hasTexture("icon_demolish")) {
      const icon = this.add.image(x - 54, y, "icon_demolish");
      icon.setScale(0.075);
      icon.setDepth(91);
    }

    const label = this.makeText(x, y - 4, "拆除", {
      fontSize: "20px",
      color: "#e2e8f0",
      fontStyle: "bold"
    });
    label.setOrigin(0.5, 0.5);
    label.setDepth(91);

    this.demolishButton = { bg, label };

    bg.on("pointerover", () => {
      if (!this.demolishMode) {
        bg.setStrokeStyle(2, 0xfb7185, 1);
      }
    });

    bg.on("pointerout", () => {
      this.updateDemolishButtonState();
    });

    bg.on("pointerdown", (pointer) => {
      if (!pointer) {
        this.beginFixedUiInteraction();
        this.toggleDemolishMode();
        return;
      }
      this.beginCardDragCandidate({ id: "demolish", name: "拆除", cost: 0, texture: "icon_demolish", type: "tool" }, pointer);
    });

    this.updateDemolishButtonState();
  }

  updateStarEnergy() {
    // 当前版本取消自然回能，保留接口方便之后切回其他经济规则。
  }

  getLogisticsColumn() {
    return this.enemyDirection < 0 ? 0 : this.cols - 1;
  }

  isShieldSlotActive(slot) {
    return this.enemyDirection < 0
      ? slot.edge >= 2
      : slot.edge <= this.cols - 2;
  }

  updateBattlefieldOrientation() {
    const logisticsColumn = this.getLogisticsColumn();
    const resourceLabelX = this.startX + logisticsColumn * this.cellW;
    const defenseStartColumn = logisticsColumn === 0 ? 1 : 0;
    const defenseEndColumn = logisticsColumn === this.cols - 1 ? this.cols - 2 : this.cols - 1;
    const defenseLabelX = this.startX + (defenseStartColumn + defenseEndColumn) * this.cellW / 2;

    this.zoneLabels.logistics.setPosition(
      resourceLabelX,
      this.startY - 58
    );
    this.zoneLabels.defense.setPosition(
      defenseLabelX,
      this.startY - 58
    );

    for (const row of this.gridCells) {
      for (const cell of row) {
        const isLogistics = cell.col === logisticsColumn;

        cell.type = isLogistics ? "logistics" : "defense";
        cell.rect.setFillStyle(isLogistics ? 0x073047 : 0x0b1220, isLogistics ? 0.82 : 0.72);
        cell.inner.setStrokeStyle(1, isLogistics ? 0x67e8f9 : 0x94a3b8, isLogistics ? 0.22 : 0.12);
        cell.logisticsMarkerCore.setVisible(isLogistics);
        cell.logisticsMarkerGlow.setVisible(isLogistics);
        this.resetCellStroke(cell);
      }
    }

    for (const slot of this.shieldSlots) {
      const isActive = this.isShieldSlotActive(slot);

      slot.active = isActive;
      slot.line.setVisible(isActive);
      slot.hitArea.setVisible(isActive);

      if (slot.hitArea.input) {
        slot.hitArea.input.enabled = isActive;
      }

      if (isActive && !slot.placed) {
        slot.line.setAlpha(1);
        slot.line.setFillStyle(0x60a5fa, 0.13);
        slot.line.setStrokeStyle(1, 0x93c5fd, 0.25);
      }
    }
  }

  updateCollectors(dt) {
    for (const producer of this.storedCollectors) {
      producer.timer += dt;

      while (producer.timer >= producer.interval) {
        producer.timer -= producer.interval;
        this.addStarEnergy(producer.amount);
      }
    }

    for (const building of this.buildings) {
      if (building.id !== "collector" || building.destroyed) continue;

      building.collectTimer += dt;

      const remain = Math.max(0, building.collectInterval - building.collectTimer);

      if (building.timerText) {
        building.timerText.setText(this.getCollectorTimerText(building, remain));
      }

      if (building.collectTimer >= building.collectInterval) {
        building.collectTimer = 0;

        this.addStarEnergy(building.collectAmount);
        this.floatText(
          building.cell.x,
          building.cell.y - 42,
          `+${building.collectAmount}`,
          this.collectorLevels[building.collectLevel].textColor
        );

        this.tweens.add({
          targets: building.core ? [building.glow, building.core] : [building.glow, building.body],
          scale: 1.45,
          alpha: 0.55,
          duration: 130,
          yoyo: true
        });
      }
    }
  }

  getCollectorTimerText(building, remainSeconds = building.collectInterval) {
    return `Lv.${building.collectLevel} +${building.collectAmount} / ${Math.ceil(remainSeconds)}s`;
  }

  getCollectorUpgradeCost(level) {
    return this.collectorUpgradeCosts[level] ?? null;
  }

  applyCollectorLevel(building, level, resetTimer = true) {
    const config = this.collectorLevels[level];
    if (!config) return;

    building.collectLevel = level;
    building.collectAmount = config.amount;
    building.collectInterval = config.interval;

    if (resetTimer) {
      building.collectTimer = 0;
    }

    building.glow.setFillStyle(config.color, 0.14);
    if (!building.usesTexture) {
      building.body.setFillStyle(config.color, 0.95);
      building.body.setStrokeStyle(3, level === this.collectorMaxLevel ? 0xfef3c7 : 0x020617, 1);
      building.core.setFillStyle(0xffffff, level === this.collectorMaxLevel ? 0.9 : 0.7);
    }
    building.text.setText(`采集 Lv.${level}`);

    if (building.timerText) {
      building.timerText.setColor(config.textColor);
      building.timerText.setText(this.getCollectorTimerText(building));
    }
  }

  canUpgradeCollector(building, showMsg = true) {
    if (!building || building.destroyed || building.id !== "collector") {
      if (showMsg) this.showMessage("这里只能升级已有星尘采集器");
      return false;
    }

    if (building.collectLevel >= this.collectorMaxLevel) {
      if (showMsg) this.showMessage("已达到最高等级");
      return false;
    }

    const cost = this.getCollectorUpgradeCost(building.collectLevel);

    if (cost === null) {
      if (showMsg) this.showMessage("已达到最高等级");
      return false;
    }

    if (this.starEnergy < cost) {
      if (showMsg) this.showMessage(`星能不足：升级需要 ${cost}`);
      return false;
    }

    return true;
  }

  tryUpgradeCollector(cell) {
    const building = cell.building;

    if (!this.canUpgradeCollector(building, true)) return;

    const nextLevel = building.collectLevel + 1;
    const cost = this.getCollectorUpgradeCost(building.collectLevel);

    this.starEnergy -= cost;
    this.applyCollectorLevel(building, nextLevel, true);

    this.floatText(cell.x, cell.y - 18, `Lv.${nextLevel}`, this.collectorLevels[nextLevel].textColor);
    this.showMessage(`星尘采集器升级到 Lv.${nextLevel}`);
    this.updateUI();
  }

  isDefenseBuildingId(id) {
    return id === "turret" || id === "laser";
  }

  getDefenseUpgradeCost(building) {
    return this.defenseUpgradeCosts[building.id]?.[building.defenseLevel] ?? null;
  }

  getDefenseBuildingLabel(id) {
    if (id === "turret") return "炮台";
    if (id === "laser") return "光棱";
    return "防御";
  }

  applyDefenseBuildingLevel(building, level, resetAttackTimer = true) {
    const config = this.defenseLevels[building.id]?.[level];
    if (!config) return;

    building.defenseLevel = level;
    building.attackDamage = config.damage;
    building.attackCooldown = config.cooldown;
    building.attackRange = config.range;

    if (resetAttackTimer) {
      building.attackTimer = building.attackCooldown;
    }

    building.glow.setFillStyle(config.color, 0.14);
    if (!building.usesTexture) {
      building.body.setFillStyle(config.color, 0.95);
      building.body.setStrokeStyle(3, level === this.defenseMaxLevel ? 0xfef3c7 : 0x020617, 1);
      building.core.setFillStyle(0xffffff, level === this.defenseMaxLevel ? 0.92 : 0.72);
    }
    building.text.setText(`${this.getDefenseBuildingLabel(building.id)} Lv.${level}`);
    building.text.setColor(config.textColor);
  }

  canUpgradeDefenseBuilding(building, card, showMsg = true) {
    if (!building || building.destroyed || !this.isDefenseBuildingId(building.id) || building.id !== card.id) {
      if (showMsg) this.showMessage("这里只能升级同类型防御建筑");
      return false;
    }

    if (building.defenseLevel >= this.defenseMaxLevel) {
      if (showMsg) this.showMessage("已达到最高等级");
      return false;
    }

    const cost = this.getDefenseUpgradeCost(building);

    if (cost === null) {
      if (showMsg) this.showMessage("已达到最高等级");
      return false;
    }

    if (this.starEnergy < cost) {
      if (showMsg) this.showMessage(`星能不足：升级需要 ${cost}`);
      return false;
    }

    return true;
  }

  tryUpgradeDefenseBuilding(cell) {
    const building = cell.building;

    if (!this.canUpgradeDefenseBuilding(building, this.selectedCard, true)) return;

    const nextLevel = building.defenseLevel + 1;
    const cost = this.getDefenseUpgradeCost(building);
    const config = this.defenseLevels[building.id][nextLevel];

    this.starEnergy -= cost;
    this.applyDefenseBuildingLevel(building, nextLevel, true);

    this.floatText(cell.x, cell.y - 18, `Lv.${nextLevel}`, config.textColor);
    this.showMessage(`${this.getDefenseBuildingLabel(building.id)}升级到 Lv.${nextLevel}`);
    this.updateUI();
  }

  getShieldUpgradeCost(level) {
    return this.shieldUpgradeCosts[level] ?? null;
  }

  updateShieldHealthBar(shield) {
    if (!shield || shield.destroyed) return;

    const ratio = Phaser.Math.Clamp(shield.currentHp / shield.maxHp, 0, 1);
    const color = ratio > 0.5 ? this.shieldLevels[shield.shieldLevel].color : ratio > 0.25 ? 0xfacc15 : 0xfb7185;

    shield.healthBarFill.setScale(ratio, 1);
    shield.healthBarFill.setFillStyle(color, 0.95);
  }

  applyShieldLevel(shield, level, refillHp = true) {
    const config = this.shieldLevels[level];
    if (!config) return;

    shield.shieldLevel = level;
    const durability = this.durabilityConfig.shield[level];

    shield.maxHp = durability.maxHp;
    shield.currentHp = refillHp
      ? durability.maxHp
      : Math.min(shield.currentHp || durability.maxHp, durability.maxHp);

    shield.slot.line.setFillStyle(config.color, 0.78);
    shield.slot.line.setStrokeStyle(2, level === this.shieldMaxLevel ? 0xfef3c7 : 0xdbeafe, 0.95);
    if (!shield.usesTexture) {
      shield.shieldCore.setFillStyle(config.color, 0.38);
      shield.shieldCore.setStrokeStyle(2, level === this.shieldMaxLevel ? 0xfef3c7 : 0xdbeafe, 0.85);
    }
    shield.text.setText(`护盾 Lv.${level}`);
    shield.text.setColor(config.textColor);

    this.updateShieldHealthBar(shield);
  }

  canUpgradeShield(shield, showMsg = true) {
    if (!shield || shield.destroyed) {
      if (showMsg) this.showMessage("这里没有可升级的引力护盾");
      return false;
    }

    if (shield.shieldLevel >= this.shieldMaxLevel) {
      if (showMsg) this.showMessage("引力护盾已达到最高等级");
      return false;
    }

    const cost = this.getShieldUpgradeCost(shield.shieldLevel);

    if (cost === null) {
      if (showMsg) this.showMessage("引力护盾已达到最高等级");
      return false;
    }

    if (this.starEnergy < cost) {
      if (showMsg) this.showMessage(`星能不足：升级需要 ${cost}`);
      return false;
    }

    return true;
  }

  tryUpgradeShield(slot) {
    const shield = slot.shield;

    if (!this.canUpgradeShield(shield, true)) return;

    const nextLevel = shield.shieldLevel + 1;
    const cost = this.getShieldUpgradeCost(shield.shieldLevel);
    const config = this.shieldLevels[nextLevel];

    this.starEnergy -= cost;
    this.applyShieldLevel(shield, nextLevel, true);

    this.floatText(slot.x, slot.y - 18, `Lv.${nextLevel}`, config.textColor);
    this.showMessage(`引力护盾升级到 Lv.${nextLevel}`);
    this.updateUI();
  }

  addStarEnergy(amount) {
    this.starEnergy += Math.floor(amount);

    if (this.starEnergy > this.maxStarEnergy) {
      this.starEnergy = this.maxStarEnergy;
    }

    this.updateUI();
  }

  floatText(x, y, content, color = "#ffffff") {
    const t = this.makeText(x, y, content, {
      fontSize: "18px",
      color,
      fontStyle: "bold"
    });

    t.setOrigin(0.5);

    this.tweens.add({
      targets: t,
      y: y - 35,
      alpha: 0,
      duration: 750,
      onComplete: () => t.destroy()
    });
  }

  createMeteorPreview() {
    this.meteorPreviewOuter = this.add.circle(
      0,
      0,
      this.meteorRange,
      0xf97316,
      0.12
    );

    this.meteorPreviewOuter.setStrokeStyle(3, 0xfacc15, 0.85);
    this.meteorPreviewOuter.setVisible(false);
    this.meteorPreviewOuter.setDepth(80);

    this.meteorPreviewInner = this.add.circle(
      0,
      0,
      18,
      0xfacc15,
      0.35
    );

    this.meteorPreviewInner.setVisible(false);
    this.meteorPreviewInner.setDepth(81);
  }

  updateMeteorPreview(pointer) {
    const shouldShow =
      !this.frontlineTransitioning &&
      !this.demolishMode &&
      this.selectedCard &&
      this.selectedCard.id === "meteor" &&
      pointer.y < this.H - 125;

    if (!shouldShow) {
      this.meteorPreviewOuter.setVisible(false);
      this.meteorPreviewInner.setVisible(false);
      return;
    }

    this.meteorPreviewOuter.setVisible(true);
    this.meteorPreviewInner.setVisible(true);

    this.meteorPreviewOuter.setPosition(pointer.x, pointer.y);
    this.meteorPreviewInner.setPosition(pointer.x, pointer.y);
  }

  clearCardSelection() {
    this.selectedCard = null;

    for (const card of this.cards) {
      card.bg.setStrokeStyle(2, 0x475569, 0.9);
      card.bg.setFillStyle(0x0b1220, 0.98);
    }
  }

  toggleDemolishMode() {
    this.setDemolishMode(!this.demolishMode);
  }

  setDemolishMode(enabled, showFeedback = true) {
    if (enabled && this.gameState !== "playing") {
      if (showFeedback) this.showMessage("本局已经结束，无法进入拆除模式");
      return;
    }

    if (enabled && this.frontlineTransitioning) {
      if (showFeedback) this.showMessage("视角转移中，请等待新战区就位");
      return;
    }

    this.demolishMode = Boolean(enabled);
    this.cancelPendingDemolish();

    if (this.demolishMode) {
      this.clearCardSelection();
    }

    this.updateMeteorPreview(this.input.activePointer);
    this.updateDemolishButtonState();
    this.updateUI();

    if (showFeedback) {
      this.showMessage(this.demolishMode ? "已进入拆除模式" : "已退出拆除模式");
    }
  }

  updateDemolishButtonState() {
    if (!this.demolishButton) return;

    const { bg, label } = this.demolishButton;

    if (this.demolishMode) {
      bg.setFillStyle(0x3f0d1d, 1);
      bg.setStrokeStyle(3, 0xfb7185, 1);
      label.setText("拆除中");
      label.setColor("#fecdd3");
      return;
    }

    bg.setFillStyle(0x0b1220, 0.98);
    bg.setStrokeStyle(2, 0x64748b, 0.95);
    label.setText("拆除");
    label.setColor("#e2e8f0");
  }

  beginCardDragCandidate(card, pointer) {
    this.beginFixedUiInteraction();
    this.cardDragState = {
      active: false,
      candidateCard: card,
      card: null,
      startX: pointer?.x ?? 0,
      startY: pointer?.y ?? 0,
      ghost: null,
      outline: null,
      valid: false
    };
  }

  createCardDragGhost(card) {
    const texture = card.texture || BUILDING_VISUALS[card.id]?.texture;
    const ghost = this.hasTexture(texture)
      ? this.add.image(0, 0, texture).setScale(card.id === "meteor" ? 0.09 : 0.10)
      : this.add.circle(0, 0, 24, 0x93c5fd, 0.5);
    ghost.setAlpha(0.5);
    ghost.setDepth(88);
    const outline = this.add.rectangle(0, 0, this.cellW - 8, this.cellH - 8, 0x22c55e, 0);
    outline.setStrokeStyle(3, 0x22c55e, 0.9);
    outline.setDepth(87);
    this.cardDragState.ghost = ghost;
    this.cardDragState.outline = outline;
  }

  getDragCell(pointer) {
    return this.gridCells.flat().find((cell) =>
      Math.abs(pointer.x - (cell.x + this.frontlineLayer.x)) <= this.cellW / 2 &&
      Math.abs(pointer.y - cell.y) <= this.cellH / 2
    ) || null;
  }

  getDragShieldSlot(pointer) {
    return this.shieldSlots.find((slot) => slot.active &&
      Math.abs(pointer.x - (slot.x + this.frontlineLayer.x)) <= 20 &&
      Math.abs(pointer.y - slot.y) <= this.cellH / 2
    ) || null;
  }

  updateCardDragGhost(pointer) {
    const state = this.cardDragState;
    if (!state?.candidateCard || !pointer?.isDown) return;
    const distance = Phaser.Math.Distance.Between(state.startX, state.startY, pointer.x, pointer.y);
    if (!state.active && distance < CARD_DRAG_THRESHOLD) return;
    if (!state.active) {
      state.active = true;
      state.card = state.candidateCard;
      this.pointerDragging = true;
      this.createCardDragGhost(state.card);
    }

    const card = state.card;
    let x = pointer.x;
    let y = pointer.y;
    let valid = false;
    let target = null;
    if (card.id === "demolish") {
      const cell = this.getDragCell(pointer);
      const slot = this.getDragShieldSlot(pointer);
      target = cell?.building || slot?.shield || null;
      valid = Boolean(target && target.frontlineId === this.frontlineIndex);
    } else if (card.id === "shield") {
      target = this.getDragShieldSlot(pointer);
      valid = Boolean(target && !target.placed && this.starEnergy >= card.cost);
    } else if (card.id === "meteor") {
      valid = pointer.y < this.H - 125 && this.starEnergy >= card.cost;
    } else {
      target = this.getDragCell(pointer);
      valid = Boolean(target && this.canPlaceCardOnCell(card, target, false));
    }
    if (target) {
      x = target.x + this.frontlineLayer.x;
      y = target.y;
    }
    state.target = target;
    state.valid = valid;
    state.ghost.setPosition(x, y).setAlpha(valid ? 0.65 : 0.40);
    state.outline.setPosition(x, y).setVisible(Boolean(target || card.id === "meteor"));
    state.outline.setStrokeStyle(3, valid ? 0x22c55e : 0xef4444, 0.95);
    if (card.id === "meteor") {
      this.meteorPreviewOuter.setVisible(valid);
      this.meteorPreviewInner.setVisible(valid);
      this.meteorPreviewOuter.setPosition(x, y);
      this.meteorPreviewInner.setPosition(x, y);
    }
  }

  finishCardDrag(pointer) {
    const state = this.cardDragState;
    if (!state?.candidateCard) return false;
    const wasDrag = state.active;
    const card = state.card || state.candidateCard;
    const target = state.target;
    const valid = state.valid;
    this.cancelCardDrag();
    if (!wasDrag) {
      if (card.id === "demolish") this.toggleDemolishMode();
      else this.selectCard(card);
      return true;
    }
    if (!valid) {
      this.showMessage("此处无法部署或星能不足");
      return true;
    }
    this.selectedCard = card;
    if (card.id === "demolish") {
      this.setDemolishMode(true, false);
      this.tryDemolishTarget(target);
    } else if (card.id === "shield") this.tryPlaceShield(target);
    else if (card.id === "meteor") this.castMeteor(pointer.x, pointer.y);
    else this.tryPlaceOnCell(target);
    return true;
  }

  cancelCardDrag() {
    const state = this.cardDragState;
    state?.ghost?.destroy();
    state?.outline?.destroy();
    this.cardDragState = { active: false, candidateCard: null, card: null, startX: 0, startY: 0, ghost: null, outline: null, valid: false };
    this.updateMeteorPreview(this.input.activePointer);
  }

  beginFixedUiInteraction() {
    this.fixedUiPointerActive = true;
    this.cancelPendingMapAction();
  }

  beginPointerInteraction(pointer) {
    if (!pointer || this.pointerPressStart) return;

    this.pointerPressStart = { x: pointer.x, y: pointer.y };
    this.pointerDragging = false;
    this.pendingDemolishTarget = null;
    this.pendingPlacementTarget = null;
    this.pendingMeteorCast = null;
    this.pointerIsTouch = this.isTouchPointer(pointer);
    this.battlefieldPanStartX = this.frontlineLayer?.x || 0;
  }

  trackPointerMovement(pointer) {
    if (!this.pointerPressStart || !pointer?.isDown) return;

    const distance = Phaser.Math.Distance.Between(
      this.pointerPressStart.x,
      this.pointerPressStart.y,
      pointer.x,
      pointer.y
    );

    if (distance < DEMOLISH_DRAG_THRESHOLD) return;

    this.pointerDragging = true;
    this.cancelPendingMapAction();

    // 触控横向拖动仅移动可移动战场层；固定 UI 始终留在原位。
    if (this.pointerIsTouch && !this.fixedUiPointerActive && !this.frontlineTransitioning) {
      const offsetX = pointer.x - this.pointerPressStart.x;
      this.frontlineLayer.x = Phaser.Math.Clamp(this.battlefieldPanStartX + offsetX, -120, 120);
    }
  }

  isTouchPointer(pointer) {
    return pointer?.pointerType === "touch" || pointer?.event?.pointerType === "touch";
  }

  queuePlacementTarget(type, target) {
    if (
      this.demolishMode ||
      this.pointerDragging ||
      this.frontlineTransitioning ||
      !this.selectedCard ||
      this.selectedCard.id === "meteor"
    ) {
      return;
    }

    this.pendingPlacementTarget = { type, target };
  }

  queueDemolishTarget(target) {
    if (!this.demolishMode || this.pointerDragging || this.frontlineTransitioning) return;

    if (!target || target.destroyed || target.frontlineId !== this.frontlineIndex) {
      this.pendingDemolishTarget = null;
      return;
    }

    this.pendingDemolishTarget = target;
  }

  finishPointerInteraction(pointer) {
    if (this.cardDragState?.candidateCard) {
      this.finishCardDrag(pointer);
      this.fixedUiPointerActive = false;
      this.pointerDragging = false;
      return;
    }

    const demolishTarget = this.pendingDemolishTarget;
    const placement = this.pendingPlacementTarget;
    const meteorCast = this.pendingMeteorCast;
    const isMapTap =
      pointer &&
      pointer.y < this.H - 125 &&
      !this.pointerDragging &&
      !this.fixedUiPointerActive &&
      !this.frontlineTransitioning;
    const shouldDemolish =
      this.demolishMode &&
      isMapTap &&
      demolishTarget;

    this.cancelPendingMapAction();
    this.pointerPressStart = null;
    this.pointerDragging = false;
    this.fixedUiPointerActive = false;
    this.pointerIsTouch = false;

    if (shouldDemolish) {
      this.tryDemolishTarget(demolishTarget);
      return;
    }

    if (isMapTap && placement) {
      if (placement.type === "cell") {
        this.tryPlaceOnCell(placement.target);
      } else if (placement.type === "shield") {
        this.tryPlaceShield(placement.target);
      }
      return;
    }

    if (isMapTap && meteorCast && this.selectedCard?.id === "meteor") {
      this.castMeteor(meteorCast.x, meteorCast.y);
    }
  }

  cancelPendingDemolish() {
    this.pendingDemolishTarget = null;
  }

  cancelPendingMapAction() {
    this.pendingDemolishTarget = null;
    this.pendingPlacementTarget = null;
    this.pendingMeteorCast = null;
  }

  selectCard(cardData) {
    if (this.gameState !== "playing") {
      this.showMessage("本局已经结束，刷新页面可重新开始");
      return;
    }

    this.setDemolishMode(false, false);
    this.selectedCard = cardData;

    for (const card of this.cards) {
      if (card.data.id === cardData.id) {
        card.bg.setStrokeStyle(3, 0xfacc15, 1);
        card.bg.setFillStyle(0x182033, 1);
      } else {
        card.bg.setStrokeStyle(2, 0x475569, 0.9);
        card.bg.setFillStyle(0x0b1220, 0.98);
      }
    }

    if (cardData.id === "collector") {
      this.showMessage("已选择：星尘采集器，点击已有采集器可升级");
    } else if (this.isDefenseBuildingId(cardData.id)) {
      this.showMessage(`已选择：${cardData.name}，点击同类建筑可升级`);
    } else if (cardData.id === "shield") {
      this.showMessage("已选择：引力护盾，点击已有护盾可升级");
    } else if (cardData.id === "meteor") {
      this.showMessage("已选择：陨星打击，点击任意位置释放");
    } else {
      this.showMessage(`已选择：${cardData.name}`);
    }

    this.updateMeteorPreview(this.input.activePointer);
  }

  resetCellStroke(cell) {
    const isLogistics = cell.type === "logistics";
    cell.rect.setStrokeStyle(2, isLogistics ? 0x00d9ff : 0x48627f, isLogistics ? 0.85 : 0.55);
  }

  hoverCell(cell, isHover) {
    if (this.demolishMode) {
      if (cell.occupied && cell.building?.frontlineId === this.frontlineIndex) {
        if (isHover) {
          cell.rect.setStrokeStyle(3, 0xfb7185, 1);
        } else {
          this.resetCellStroke(cell);
        }
      }

      return;
    }

    if (!this.selectedCard) return;

    if (cell.occupied) {
      if (this.selectedCard.id === "collector" && cell.building?.id === "collector") {
        if (isHover) {
          const canUpgrade = this.canUpgradeCollector(cell.building, false);
          cell.rect.setStrokeStyle(3, canUpgrade ? 0x22c55e : 0xef4444, 1);
        } else {
          this.resetCellStroke(cell);
        }
      } else if (this.isDefenseBuildingId(this.selectedCard.id) && cell.building?.id === this.selectedCard.id) {
        if (isHover) {
          const canUpgrade = this.canUpgradeDefenseBuilding(cell.building, this.selectedCard, false);
          cell.rect.setStrokeStyle(3, canUpgrade ? 0x22c55e : 0xef4444, 1);
        } else {
          this.resetCellStroke(cell);
        }
      }

      return;
    }

    if (this.selectedCard.id === "shield") return;
    if (this.selectedCard.id === "meteor") return;

    if (isHover) {
      const canPlace = this.canPlaceCardOnCell(this.selectedCard, cell, false);
      cell.rect.setStrokeStyle(3, canPlace ? 0x22c55e : 0xef4444, 1);
    } else {
      this.resetCellStroke(cell);
    }
  }

  canPlaceCardOnCell(card, cell, showMsg = true) {
    if (this.starEnergy < card.cost) {
      if (showMsg) this.showMessage("星能不足");
      return false;
    }

    if (cell.occupied) {
      if (showMsg) this.showMessage("这里已经有建筑了");
      return false;
    }

    if (card.id === "collector" && cell.type !== "logistics") {
      if (showMsg) this.showMessage("星尘采集器只能部署在资源区");
      return false;
    }

    if ((card.id === "turret" || card.id === "laser") && cell.type === "logistics") {
      if (showMsg) this.showMessage("资源区不适合部署攻击建筑");
      return false;
    }

    return true;
  }

  tryPlaceOnCell(cell) {
    if (this.gameState !== "playing") return;

    if (this.frontlineTransitioning) {
      this.showMessage("视角转移中，请等待新战区就位");
      return;
    }

    if (!this.selectedCard) {
      this.showMessage("请先选择一张卡牌");
      return;
    }

    if (this.selectedCard.id === "shield") {
      this.showMessage("引力护盾要部署在两列之间的蓝色细线上");
      return;
    }

    if (this.selectedCard.id === "meteor") {
      return;
    }

    if (cell.occupied) {
      if (this.selectedCard.id === "collector") {
        this.tryUpgradeCollector(cell);
      } else if (this.isDefenseBuildingId(this.selectedCard.id)) {
        this.tryUpgradeDefenseBuilding(cell);
      } else {
        this.showMessage("这里已经有建筑了");
      }

      return;
    }

    if (!this.canPlaceCardOnCell(this.selectedCard, cell, true)) return;

    this.starEnergy -= this.selectedCard.cost;
    cell.occupied = true;

    this.placeBuildingVisual(this.selectedCard, cell);
    this.updateUI();
  }

  placeBuildingVisual(card, cell) {
    let color = 0x38bdf8;
    let label = "炮台";

    if (card.id === "collector") {
      color = 0x22c55e;
      label = "采集";
    }

    if (card.id === "turret") {
      color = 0x38bdf8;
      label = "炮台";
    }

    if (card.id === "laser") {
      color = 0xfacc15;
      label = "光棱";
    }

    const durability = this.durabilityConfig.building[card.id];
    const healthBar = this.durabilityConfig.healthBar;
    const glow = this.addToFrontline(this.add.circle(cell.x, cell.y, 28, color, 0.12));

    const visualConfig = BUILDING_VISUALS[card.id];
    const usesTexture = visualConfig && this.hasTexture(visualConfig.texture);
    const body = usesTexture
      ? this.addToFrontline(this.add.image(cell.x, cell.y, visualConfig.texture).setScale(visualConfig.scale))
      : this.addToFrontline(this.add.rectangle(cell.x, cell.y, 44, 44, color, 0.95));
    if (!usesTexture) body.setStrokeStyle(3, 0x020617, 1);

    const core = usesTexture ? null : this.addToFrontline(this.add.circle(cell.x, cell.y, 8, 0xffffff, 0.7));

    const text = this.makeFrontlineText(cell.x, cell.y + 29, label, {
      fontSize: "12px",
      color: "#dbeafe",
      fontStyle: "bold"
    });
    text.setOrigin(0.5, 0);

    const healthBarBg = this.addToFrontline(this.add.rectangle(
      cell.x - healthBar.buildingWidth / 2,
      cell.y + healthBar.buildingOffsetY,
      healthBar.buildingWidth,
      healthBar.height,
      0x020617,
      0.9
    ));
    healthBarBg.setOrigin(0, 0.5);

    const healthBarFill = this.addToFrontline(this.add.rectangle(
      cell.x - healthBar.buildingWidth / 2,
      cell.y + healthBar.buildingOffsetY,
      healthBar.buildingWidth,
      healthBar.height,
      0x22c55e,
      0.95
    ));
    healthBarFill.setOrigin(0, 0.5);

    let timerText = null;
    let attackDamage = 0;
    let attackCooldown = 0;
    let attackRange = 0;

    if (card.id === "collector") {
      timerText = this.makeFrontlineText(cell.x, cell.y - 44, "", {
        fontSize: "12px",
        color: "#86efac",
        fontStyle: "bold"
      });

      timerText.setOrigin(0.5, 0);
    }

    const building = {
      id: card.id,
      targetType: "building",
      frontlineId: cell.frontlineId,
      region: cell.type,
      cell,
      body,
      glow,
      core,
      visual: body,
      usesTexture,
      text,
      healthBarBg,
      healthBarFill,
      deploymentCost: card.cost,
      maxHp: durability.maxHp,
      currentHp: durability.maxHp,
      destroyed: false,

      collectLevel: 0,
      collectTimer: 0,
      collectInterval: 0,
      collectAmount: 0,
      timerText,

      attackDamage,
      attackCooldown,
      attackRange,
      attackTimer: 0,
      defenseLevel: 0
    };

    if (card.id === "collector") {
      this.applyCollectorLevel(building, 1, false);
    }

    if (this.isDefenseBuildingId(card.id)) {
      this.applyDefenseBuildingLevel(building, 1, true);
    }

    this.updateBuildingHealthBar(building);

    cell.building = building;
    this.buildings.push(building);

    this.tweens.add({
      targets: core ? [glow, core] : [glow, body],
      scale: 1.18,
      alpha: 0.28,
      duration: 900,
      yoyo: true,
      repeat: -1
    });

    this.showMessage(`${card.name} 已部署`);
  }

  tryPlaceShield(slot) {
    if (this.gameState !== "playing") return;

    if (this.frontlineTransitioning) {
      this.showMessage("视角转移中，请等待新战区就位");
      return;
    }

    if (!this.selectedCard) {
      this.showMessage("请先选择引力护盾卡牌");
      return;
    }

    if (this.selectedCard.id !== "shield") {
      this.showMessage("这里只能部署引力护盾");
      return;
    }

    if (!slot.active) {
      this.showMessage("核心近轨区禁止部署引力护盾");
      return;
    }

    if (slot.placed) {
      this.tryUpgradeShield(slot);
      return;
    }

    if (this.starEnergy < this.selectedCard.cost) {
      this.showMessage("星能不足");
      return;
    }

    this.starEnergy -= this.selectedCard.cost;
    slot.placed = true;

    slot.line.setFillStyle(0x93c5fd, 0.78);
    slot.line.setStrokeStyle(2, 0xdbeafe, 0.95);

    const healthBar = this.durabilityConfig.healthBar;
    const shieldUsesTexture = this.hasTexture(BUILDING_VISUALS.shield.texture);
    const shieldCore = shieldUsesTexture
      ? this.addToFrontline(this.add.image(slot.x, slot.y, BUILDING_VISUALS.shield.texture).setScale(BUILDING_VISUALS.shield.scale))
      : this.addToFrontline(this.add.rectangle(slot.x, slot.y, 14, this.cellH - 12, 0x93c5fd, 0.38));
    if (!shieldUsesTexture) shieldCore.setStrokeStyle(2, 0xdbeafe, 0.85);

    const shieldHpBg = this.addToFrontline(this.add.rectangle(
      slot.x - healthBar.shieldWidth / 2,
      slot.y + healthBar.shieldOffsetY,
      healthBar.shieldWidth,
      healthBar.height,
      0x020617,
      0.85
    ));
    shieldHpBg.setOrigin(0, 0.5);

    const shieldHpFill = this.addToFrontline(this.add.rectangle(
      slot.x - healthBar.shieldWidth / 2,
      slot.y + healthBar.shieldOffsetY,
      healthBar.shieldWidth,
      healthBar.height,
      0x93c5fd,
      0.95
    ));
    shieldHpFill.setOrigin(0, 0.5);

    const shieldText = this.makeFrontlineText(slot.x, slot.y + 37, "", {
      fontSize: "11px",
      color: "#dbeafe",
      fontStyle: "bold"
    });
    shieldText.setOrigin(0.5, 0);

    this.tweens.add({
      targets: [slot.line, shieldCore],
      alpha: 0.35,
      duration: 650,
      yoyo: true,
      repeat: -1
    });

    const shield = {
      targetType: "shield",
      frontlineId: slot.frontlineId,
      region: "shield",
      slot,
      shieldCore,
      usesTexture: shieldUsesTexture,
      healthBarBg: shieldHpBg,
      healthBarFill: shieldHpFill,
      text: shieldText,
      deploymentCost: this.selectedCard.cost,
      shieldLevel: 0,
      currentHp: 0,
      maxHp: 0,
      destroyed: false
    };

    this.applyShieldLevel(shield, 1, true);

    slot.shield = shield;
    this.shields.push(shield);

    this.showMessage("引力护盾已展开");
    this.updateUI();
  }

  castMeteor(x, y) {
    if (this.gameState !== "playing") return;

    if (!this.selectedCard || this.selectedCard.id !== "meteor") return;

    if (this.starEnergy < this.selectedCard.cost) {
      this.showMessage("星能不足");
      return;
    }

    this.starEnergy -= this.selectedCard.cost;

    const warning = this.add.circle(x, y, this.meteorRange, 0xf97316, 0.08);
    warning.setStrokeStyle(3, 0xfacc15, 0.75);

    const outer = this.add.circle(x, y, this.meteorRange, 0xf97316, 0.18);
    outer.setStrokeStyle(4, 0xfacc15, 0.8);

    const inner = this.add.circle(x, y, 35, 0xfacc15, 0.35);

    this.tweens.add({
      targets: warning,
      scale: 1.08,
      alpha: 0,
      duration: 520,
      onComplete: () => warning.destroy()
    });

    this.tweens.add({
      targets: outer,
      scale: 1.35,
      alpha: 0,
      duration: 420,
      onComplete: () => outer.destroy()
    });

    this.tweens.add({
      targets: inner,
      scale: 2.2,
      alpha: 0,
      duration: 380,
      onComplete: () => inner.destroy()
    });

    for (let i = 0; i < 16; i++) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(30, 105);
      const p = this.add.circle(x, y, 3, 0xfacc15, 0.9);

      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        duration: 500,
        onComplete: () => p.destroy()
      });
    }

    let hitCount = 0;

    for (const enemy of [...this.enemies]) {
      const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);

      if (dist <= this.meteorRange + enemy.radius) {
        this.damageEnemy(enemy, this.meteorDamage);
        hitCount++;
      }
    }

    this.showMessage(hitCount > 0 ? `陨星打击命中 ${hitCount} 个敌人` : "陨星打击已释放");
    this.updateUI();
  }

  updateWaves(dt) {
    const wave = this.getWaveConfig(this.currentWaveIndex);

    if (!this.waveActive && this.waveSpawned === 0) {
      this.waveStartTimer -= dt;

      if (this.waveStartTimer <= 0) {
        this.startWave();
      }

      this.updateUI();
      return;
    }

    if (this.waveActive) {
      this.waveSpawnTimer -= dt;

      while (this.waveSpawnTimer <= 0 && this.waveSpawned < wave.count) {
        this.spawnEnemy(wave);
        this.waveSpawned++;
        this.waveSpawnTimer += wave.interval;
      }

      if (this.waveSpawned >= wave.count) {
        this.waveActive = false;
      }
    }

    if (!this.waveActive && this.waveSpawned >= wave.count && this.enemies.length === 0) {
      const completedWave = this.currentWaveIndex + 1;

      this.currentWaveIndex++;
      this.waveSpawned = 0;
      this.waveStartTimer = this.waveRestTime;

      if (completedWave % this.wavesPerFrontline === 0) {
        this.switchFrontline(completedWave);
      } else {
        this.showMessage(`第 ${this.currentWaveIndex} 波已清除，准备第 ${this.currentWaveIndex + 1} 波`);
      }
    }

    this.updateUI();
  }

  startWave() {
    this.waveActive = true;
    this.waveSpawnTimer = 0;

    this.showMessage(`${this.getFrontlineLabel()}第 ${this.currentWaveIndex + 1} 波虚空敌人来袭`);
    this.updateUI();
  }

  getWaveConfig(waveIndex) {
    const template = this.waveTemplates[waveIndex % this.waveTemplates.length];
    const decade = Math.floor(waveIndex / this.waveTemplates.length);
    const hpBonus = waveIndex * 4 + decade * 22;

    return {
      count: template.count,
      interval: template.interval,
      hp: template.hp + hpBonus,
      speed: template.speed + Math.min(decade * 3, 15),
      damage: template.damage + decade + Math.floor(waveIndex / 15),
      reward: template.reward
    };
  }

  getFrontlineLabel() {
    return this.enemyDirection < 0 ? "右翼战区 " : "左翼战区 ";
  }

  switchFrontline(completedWave) {
    if (this.frontlineTransitioning) return;

    const savedCount = this.saveCollectorOutput();
    const outgoingX = -this.enemyDirection * this.W;

    this.cancelPendingDemolish();
    this.pointerPressStart = null;
    this.pointerDragging = false;
    this.fixedUiPointerActive = false;
    this.clearCurrentFrontline();
    this.frontlineTransitioning = true;
    this.waveStartTimer = this.waveRestTime;
    this.updateMeteorPreview(this.input.activePointer);

    this.showMessage(`第 ${completedWave} 波清除，保存 ${savedCount} 个采集器，正在平移视角`);
    this.updateUI();

    this.tweens.add({
      targets: this.frontlineLayer,
      x: outgoingX,
      duration: 620,
      ease: "Cubic.easeIn",
      onComplete: () => this.enterNextFrontline(outgoingX)
    });
  }

  enterNextFrontline(outgoingX) {
    const oldPortalX = this.portalX;
    const oldPlanetX = this.planetX;

    this.enemyDirection *= -1;
    [this.portalX, this.planetX] = [this.planetX, this.portalX];
    this.moveVisuals(this.portalVisuals, this.portalX - oldPortalX, 0);
    this.moveVisuals(this.planetVisuals, this.planetX - oldPlanetX, 0);
    this.updateBattlefieldOrientation();
    this.updateDirectionVisuals();
    this.frontlineIndex++;
    this.updateFrontlineOwnership();
    this.frontlineLayer.x = -outgoingX;

    this.showMessage(`正在进入${this.getFrontlineLabel()}，远端采集器继续产出`);
    this.updateUI();

    this.tweens.add({
      targets: this.frontlineLayer,
      x: 0,
      duration: 620,
      ease: "Cubic.easeOut",
      onComplete: () => this.finishFrontlineTransition()
    });
  }

  finishFrontlineTransition() {
    this.frontlineLayer.x = 0;
    this.frontlineTransitioning = false;
    this.showMessage(`${this.getFrontlineLabel()}已就位，准备下一波`);
    this.updateUI();
  }

  moveVisuals(items, dx, dy) {
    for (const item of items) {
      item.x += dx;
      item.y += dy;
    }
  }

  updateDirectionVisuals() {
    const isLeftFrontline = this.enemyDirection > 0;
    const arrowText = isLeftFrontline ? "→" : "←";
    const baseX = isLeftFrontline ? 280 : 1000;
    const step = isLeftFrontline ? 130 : -130;

    for (let i = 0; i < this.directionArrows.length; i++) {
      const arrow = this.directionArrows[i];

      arrow.setText(arrowText);
      arrow.setPosition(baseX + i * step, this.H / 2 - 58);
    }

    this.directionLabel.setPosition(isLeftFrontline ? 270 : 920, this.H / 2 - 105);
  }

  updateFrontlineOwnership() {
    for (const row of this.gridCells) {
      for (const cell of row) {
        cell.frontlineId = this.frontlineIndex;
      }
    }

    for (const slot of this.shieldSlots) {
      slot.frontlineId = this.frontlineIndex;
    }
  }

  saveCollectorOutput() {
    let savedCount = 0;

    for (const building of this.buildings) {
      if (building.id !== "collector" || building.destroyed) continue;

      this.storedCollectors.push({
        frontlineId: building.frontlineId,
        level: building.collectLevel,
        amount: building.collectAmount,
        interval: building.collectInterval,
        timer: building.collectTimer
      });

      savedCount++;
    }

    return savedCount;
  }

  getCollectorCounts() {
    const current = this.buildings.filter((building) => building.id === "collector" && !building.destroyed).length;
    const stored = this.storedCollectors.length;

    return {
      current,
      stored,
      total: current + stored
    };
  }

  clearCurrentFrontline() {
    for (const projectile of [...this.projectiles]) {
      this.removeProjectile(projectile);
    }

    for (const shield of [...this.shields]) {
      this.removeShield(shield);
    }

    for (const enemy of [...this.enemies]) {
      this.destroyEnemy(enemy, false);
    }

    for (const building of [...this.buildings]) {
      this.destroyBuilding(building);
    }

    this.buildings = [];

    for (const row of this.gridCells) {
      for (const cell of row) {
        cell.occupied = false;
        cell.building = null;
        this.resetCellStroke(cell);
      }
    }
  }

  getDemolishRefund(target) {
    if (!target || DEMOLISH_REFUND_RATE <= 0) return 0;

    return Math.floor((target.deploymentCost || 0) * DEMOLISH_REFUND_RATE);
  }

  tryDemolishTarget(target) {
    if (
      !this.demolishMode ||
      this.frontlineTransitioning ||
      !target ||
      target.destroyed ||
      target.frontlineId !== this.frontlineIndex
    ) {
      return false;
    }

    if (
      target.targetType === "building" &&
      this.buildings.includes(target) &&
      target.cell?.building === target
    ) {
      return this.demolishBuilding(target);
    }

    if (
      target.targetType === "shield" &&
      this.shields.includes(target) &&
      target.slot?.shield === target
    ) {
      return this.demolishShield(target);
    }

    return false;
  }

  demolishBuilding(building) {
    if (
      !building ||
      building.destroyed ||
      building.frontlineId !== this.frontlineIndex ||
      building.cell?.building !== building
    ) {
      return false;
    }

    const x = building.cell.x;
    const y = building.cell.y;
    const refund = this.getDemolishRefund(building);

    this.destroyBuilding(building);

    if (refund > 0) {
      this.addStarEnergy(refund);
      this.floatText(x, y - 22, `拆除 +${refund}`, "#facc15");
      this.showMessage(`建筑已拆除，返还 ${refund} 星能`);
    } else {
      this.floatText(x, y - 22, "已拆除", "#fb7185");
      this.showMessage("建筑已拆除");
    }

    return true;
  }

  demolishShield(shield) {
    if (
      !shield ||
      shield.destroyed ||
      shield.frontlineId !== this.frontlineIndex ||
      shield.slot?.shield !== shield
    ) {
      return false;
    }

    const x = shield.slot.x;
    const y = shield.slot.y;
    const refund = this.getDemolishRefund(shield);

    this.removeShield(shield);

    if (refund > 0) {
      this.addStarEnergy(refund);
      this.floatText(x, y - 22, `拆除 +${refund}`, "#facc15");
      this.showMessage(`引力护盾已拆除，返还 ${refund} 星能`);
    } else {
      this.floatText(x, y - 22, "已拆除", "#fb7185");
      this.showMessage("引力护盾已拆除");
    }

    return true;
  }

  updateBuildingHealthBar(building) {
    if (!building || building.destroyed) return;

    const ratio = Phaser.Math.Clamp(building.currentHp / building.maxHp, 0, 1);
    const color = ratio > 0.5 ? 0x22c55e : ratio > 0.25 ? 0xfacc15 : 0xfb7185;

    building.healthBarFill.setScale(ratio, 1);
    building.healthBarFill.setFillStyle(color, 0.95);
  }

  damageBuilding(building, amount) {
    if (!building || building.destroyed) return;

    building.currentHp = Math.max(0, building.currentHp - amount);
    this.updateBuildingHealthBar(building);

    if (building.currentHp <= 0) {
      const label = building.text?.text || "建筑";
      this.destroyBuilding(building);
      this.showMessage(`${label}被摧毁，敌人继续推进`);
    }
  }

  destroyBuilding(building) {
    if (!building || building.destroyed) return;

    building.destroyed = true;
    this.clearEnemyTargetsFor(building);

    if (building.cell?.building === building) {
      building.cell.occupied = false;
      building.cell.building = null;
      this.resetCellStroke(building.cell);
    }

    const index = this.buildings.indexOf(building);

    if (index !== -1) {
      this.buildings.splice(index, 1);
    }

    this.tweens.killTweensOf([building.glow, building.body]);

    building.glow.destroy();
    building.body.destroy();
    building.core?.destroy();
    building.text.destroy();
    building.healthBarBg.destroy();
    building.healthBarFill.destroy();

    if (building.timerText) {
      building.timerText.destroy();
    }

    this.updateUI();
  }

  spawnEnemy(wave) {
    const row = Phaser.Math.Between(0, this.rows - 1);
    const x = this.portalX + this.enemyDirection * 12;
    const y = this.startY + row * this.cellH;

    const aura = this.add.circle(0, 0, 22, 0xfb7185, 0.14);
    const enemyVisual = ENEMY_VISUALS.basic;
    const usesTexture = this.hasTexture(enemyVisual.texture);
    const body = usesTexture
      ? this.add.image(0, 0, enemyVisual.texture).setScale(enemyVisual.scale)
      : this.add.rectangle(0, 0, 32, 24, 0xbe123c, 0.96);
    if (!usesTexture) {
      body.setStrokeStyle(3, 0x3f0618, 1);
      body.setAngle(45);
    }

    const core = usesTexture ? null : this.add.circle(-4, -2, 6, 0xffc4d6, 0.9);

    const hpBg = this.add.rectangle(-19, -27, 38, 5, 0x020617, 0.9);
    hpBg.setOrigin(0, 0.5);

    const hpFill = this.add.rectangle(-19, -27, 38, 5, 0x22c55e, 1);
    hpFill.setOrigin(0, 0.5);

    const children = core ? [aura, body, core, hpBg, hpFill] : [aura, body, hpBg, hpFill];
    const container = this.addToFrontline(this.add.container(x, y, children));
    container.setDepth(70);

    const enemy = {
      row,
      frontlineId: this.frontlineIndex,
      x,
      y,
      lastX: x,
      hp: wave.hp,
      maxHp: wave.hp,
      speed: wave.speed,
      damage: wave.damage,
      attackCooldown: this.enemyCombatConfig.attackInterval,
      attackTimer: 0,
      attackTarget: null,
      reward: wave.reward,
      direction: this.enemyDirection,
      radius: 18,
      container,
      hpFill,
      dead: false
    };

    this.enemies.push(enemy);

    const flash = this.addToFrontline(this.add.circle(x, y, 28, 0xe879f9, 0.22));
    flash.setDepth(66);

    this.tweens.add({
      targets: flash,
      scale: 1.5,
      alpha: 0,
      duration: 260,
      onComplete: () => flash.destroy()
    });
  }

  updateEnemyAttacks(dt) {
    for (const enemy of this.enemies) {
      if (enemy.dead || !enemy.attackTarget) continue;

      if (!this.isValidEnemyTarget(enemy, enemy.attackTarget)) {
        this.clearEnemyTarget(enemy);
        continue;
      }

      enemy.attackTimer += dt;

      while (enemy.attackTarget && enemy.attackTimer >= enemy.attackCooldown) {
        const target = enemy.attackTarget;

        enemy.attackTimer -= enemy.attackCooldown;

        if (!this.isValidEnemyTarget(enemy, target)) {
          this.clearEnemyTarget(enemy);
          break;
        }

        if (target.targetType === "building") {
          this.damageBuilding(target, enemy.damage);
        } else {
          this.damageShield(target, enemy.damage);
        }

        if (!enemy.dead) {
          this.tweens.add({
            targets: enemy.container,
            scale: 1.08,
            duration: 80,
            yoyo: true
          });
        }
      }
    }
  }

  updateEnemies(dt) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      if (enemy.dead) continue;

      if (enemy.attackTarget) {
        if (this.isValidEnemyTarget(enemy, enemy.attackTarget)) {
          continue;
        }

        this.clearEnemyTarget(enemy);
      }

      enemy.lastX = enemy.x;
      enemy.x += enemy.speed * enemy.direction * dt;
      enemy.container.x = enemy.x;

      const blockingTarget = this.findBlockingTarget(enemy);

      if (blockingTarget) {
        this.startEnemyAttack(enemy, blockingTarget);
        continue;
      }

      const hitPlanet = enemy.direction < 0
        ? enemy.x <= this.planetX + 65
        : enemy.x >= this.planetX - 65;

      if (hitPlanet) {
        this.damagePlanet(enemy.damage);
        this.destroyEnemy(enemy, false);
      }
    }
  }

  findBlockingTarget(enemy) {
    const candidates = [];

    for (const building of this.buildings) {
      if (
        building.destroyed ||
        building.frontlineId !== enemy.frontlineId ||
        building.cell.row !== enemy.row
      ) {
        continue;
      }

      const contactX = this.getBlockingContactX(enemy, building);

      if (this.hasEnemyReachedContact(enemy, contactX)) {
        candidates.push({ target: building, contactX });
      }
    }

    for (const shield of this.shields) {
      if (
        shield.destroyed ||
        shield.frontlineId !== enemy.frontlineId ||
        shield.slot.row !== enemy.row
      ) {
        continue;
      }

      const contactX = this.getBlockingContactX(enemy, shield);

      if (this.hasEnemyReachedContact(enemy, contactX)) {
        candidates.push({ target: shield, contactX });
      }
    }

    candidates.sort((a, b) => enemy.direction < 0
      ? b.contactX - a.contactX
      : a.contactX - b.contactX);

    return candidates[0]?.target ?? null;
  }

  getBlockingContactX(enemy, target) {
    if (target.targetType === "shield") {
      return target.slot.x - enemy.direction * enemy.radius;
    }

    const halfWidth = this.durabilityConfig.building[target.id].collisionHalfWidth;
    return target.cell.x - enemy.direction * (halfWidth + enemy.radius);
  }

  hasEnemyReachedContact(enemy, contactX) {
    if (enemy.direction < 0) {
      return enemy.lastX >= contactX && enemy.x <= contactX;
    }

    return enemy.lastX <= contactX && enemy.x >= contactX;
  }

  startEnemyAttack(enemy, target) {
    if (!this.isValidEnemyTarget(enemy, target)) return;

    enemy.x = this.getBlockingContactX(enemy, target);
    enemy.lastX = enemy.x;
    enemy.container.x = enemy.x;
    enemy.attackTarget = target;
    enemy.attackTimer = 0;
  }

  isValidEnemyTarget(enemy, target) {
    if (!enemy || enemy.dead || !target || target.destroyed) return false;
    if (target.frontlineId !== enemy.frontlineId) return false;

    if (target.targetType === "building") {
      return (
        this.buildings.includes(target) &&
        target.cell?.building === target &&
        target.cell.row === enemy.row
      );
    }

    if (target.targetType === "shield") {
      return (
        this.shields.includes(target) &&
        target.slot?.shield === target &&
        target.slot.row === enemy.row
      );
    }

    return false;
  }

  clearEnemyTarget(enemy, expectedTarget = null) {
    if (!enemy || (expectedTarget && enemy.attackTarget !== expectedTarget)) return;

    enemy.attackTarget = null;
    enemy.attackTimer = 0;
  }

  clearEnemyTargetsFor(target) {
    if (!target) return;

    for (const enemy of this.enemies) {
      this.clearEnemyTarget(enemy, target);
    }
  }

  damagePlanet(amount) {
    this.planetHp = Math.max(0, this.planetHp - amount);

    this.floatText(this.planetX, this.planetY - 78, `-${amount}`, "#fb7185");
    this.showMessage(`虚空敌人撞击星球，生命 -${amount}`);

    if (this.planetHp <= 0) {
      this.loseGame();
    } else {
      this.updateUI();
    }
  }

  updateBuildingAttacks(dt) {
    for (const building of this.buildings) {
      if (
        building.destroyed ||
        building.frontlineId !== this.frontlineIndex ||
        building.attackDamage <= 0
      ) {
        continue;
      }

      building.attackTimer += dt;

      if (building.attackTimer < building.attackCooldown) continue;

      const target = this.findTargetForBuilding(building);

      if (!target) {
        building.attackTimer = building.attackCooldown;
        continue;
      }

      building.attackTimer = 0;
      this.fireBuildingAt(building, target);
    }
  }

  findTargetForBuilding(building) {
    let bestTarget = null;
    let bestDistance = Infinity;

    for (const enemy of this.enemies) {
      if (enemy.dead || enemy.frontlineId !== building.frontlineId) continue;
      const distance = Phaser.Math.Distance.Between(building.cell.x, building.cell.y, enemy.x, enemy.y);

      if (distance > building.attackRange) {
        continue;
      }

      if (distance < bestDistance) {
        bestDistance = distance;
        bestTarget = enemy;
      }
    }

    return bestTarget;
  }

  fireBuildingAt(building, target) {
    if (building.id === "turret") {
      this.fireTurretBullet(building, target);
      return;
    }

    this.fireLaserBeam(building, target);
  }

  fireTurretBullet(building, target) {
    const muzzleX = building.cell.x - target.direction * 18;
    const bullet = this.addToFrontline(this.add.circle(muzzleX, building.cell.y, 6, 0x38bdf8, 0.95));
    bullet.setStrokeStyle(2, 0xdbeafe, 0.9);
    bullet.setDepth(69);

    this.projectiles.push({
      sprite: bullet,
      target,
      damage: building.attackDamage,
      speed: 520,
      life: 1.6
    });

    this.tweens.add({
      targets: building.core || building.body,
      scale: 1.55,
      duration: 80,
      yoyo: true
    });
  }

  fireLaserBeam(building, target) {
    const color = building.id === "laser" ? 0xfacc15 : 0x38bdf8;
    const width = building.id === "laser" ? 4 : 2;
    const shot = this.addToFrontline(this.add.graphics());

    shot.setDepth(68);
    shot.lineStyle(width, color, 0.9);
    shot.beginPath();
    shot.moveTo(building.cell.x - target.direction * 18, building.cell.y);
    shot.lineTo(target.x + target.direction * target.radius, target.y);
    shot.strokePath();

    this.tweens.add({
      targets: shot,
      alpha: 0,
      duration: 120,
      onComplete: () => shot.destroy()
    });

    this.tweens.add({
      targets: building.core || building.body,
      scale: 1.55,
      duration: 80,
      yoyo: true
    });

    this.damageEnemy(target, building.attackDamage);
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      const target = projectile.target;

      projectile.life -= dt;

      if (!target || target.dead || projectile.life <= 0) {
        this.removeProjectile(projectile, i);
        continue;
      }

      const dx = target.x - projectile.sprite.x;
      const dy = target.y - projectile.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= target.radius + 5) {
        this.damageEnemy(target, projectile.damage);
        this.removeProjectile(projectile, i);
        continue;
      }

      const move = projectile.speed * dt;
      const step = Math.min(move, dist);

      projectile.sprite.x += (dx / dist) * step;
      projectile.sprite.y += (dy / dist) * step;
    }
  }

  removeProjectile(projectile, index = this.projectiles.indexOf(projectile)) {
    projectile.sprite.destroy();

    if (index !== -1) {
      this.projectiles.splice(index, 1);
    }
  }

  damageEnemy(enemy, amount) {
    if (!enemy || enemy.dead) return;

    enemy.hp = Math.max(0, enemy.hp - amount);
    this.updateEnemyHealthBar(enemy);

    if (enemy.hp <= 0) {
      this.destroyEnemy(enemy, true);
    }
  }

  updateEnemyHealthBar(enemy) {
    const ratio = Phaser.Math.Clamp(enemy.hp / enemy.maxHp, 0, 1);
    const color = ratio > 0.5 ? 0x22c55e : ratio > 0.25 ? 0xfacc15 : 0xfb7185;

    enemy.hpFill.setScale(ratio, 1);
    enemy.hpFill.setFillStyle(color, 1);
  }

  destroyEnemy(enemy, giveReward) {
    if (!enemy || enemy.dead) return;

    enemy.dead = true;
    this.clearEnemyTarget(enemy);

    const index = this.enemies.indexOf(enemy);
    const reward = enemy.reward;
    const x = enemy.x;
    const y = enemy.y;

    if (index !== -1) {
      this.enemies.splice(index, 1);
    }

    this.tweens.killTweensOf(enemy.container);
    enemy.container.destroy();

    if (giveReward && reward > 0) {
      this.addStarEnergy(reward);
      this.floatText(x, y - 30, `+${reward}`, "#facc15");
    } else {
      this.updateUI();
    }
  }

  damageShield(shield, amount) {
    if (!shield || shield.destroyed) return;

    shield.currentHp = Math.max(0, shield.currentHp - amount);
    this.updateShieldHealthBar(shield);

    if (shield.currentHp <= 0) {
      this.removeShield(shield);
      this.showMessage("引力护盾被击穿");
    }
  }

  removeShield(shield) {
    if (!shield || shield.destroyed) return;

    shield.destroyed = true;
    this.clearEnemyTargetsFor(shield);

    if (shield.slot?.shield === shield) {
      shield.slot.placed = false;
      shield.slot.shield = null;
    }

    this.tweens.killTweensOf([shield.slot.line, shield.shieldCore]);

    shield.slot.line.setAlpha(1);
    shield.slot.line.setFillStyle(0x60a5fa, 0.13);
    shield.slot.line.setStrokeStyle(1, 0x93c5fd, 0.25);

    shield.shieldCore.destroy();
    shield.healthBarBg.destroy();
    shield.healthBarFill.destroy();
    shield.text.destroy();

    const index = this.shields.indexOf(shield);

    if (index !== -1) {
      this.shields.splice(index, 1);
    }
  }

  loseGame() {
    if (this.gameState !== "playing") return;

    this.gameState = "lost";
    this.planetHp = 0;
    this.demolishMode = false;
    this.cancelPendingDemolish();
    this.clearCardSelection();
    this.updateDemolishButtonState();
    this.updateMeteorPreview(this.input.activePointer);
    this.showMessage("晨曦星失守，虚空突破了防线");
    this.updateUI();
  }

  getWaveText() {
    if (this.gameState === "lost") {
      return `波次：第 ${this.currentWaveIndex + 1} 波  失败`;
    }

    if (this.frontlineTransitioning) {
      return `波次：第 ${this.currentWaveIndex + 1} 波  战区转移中`;
    }

    const waveNumber = this.currentWaveIndex + 1;

    if (!this.waveActive && this.waveSpawned === 0 && this.waveStartTimer > 0) {
      return `波次：第 ${waveNumber} 波  准备 ${Math.ceil(this.waveStartTimer)}s`;
    }

    const wave = this.getWaveConfig(this.currentWaveIndex);
    const waitingEnemies = wave ? Math.max(0, wave.count - this.waveSpawned) : 0;

    return `波次：第 ${waveNumber} 波  场上：${this.enemies.length}  待刷：${waitingEnemies}`;
  }

  handleGlobalClick(pointer) {
    if (this.gameState !== "playing") return;

    if (this.fixedUiPointerActive) return;

    if (pointer.y > this.H - 125) return;

    if (this.frontlineTransitioning) return;

    if (this.pointerDragging || this.demolishMode) return;

    if (!this.selectedCard) return;

    if (this.selectedCard.id === "meteor") {
      this.pendingMeteorCast = { x: pointer.x, y: pointer.y };
    }
  }

  showMessage(text) {
    this.messageText.setText(text);
    this.messageContainer.setVisible(true);
    this.messageContainer.setActive(true);
    this.messageContainer.setAlpha(1);

    this.tweens.killTweensOf(this.messageContainer);

    this.tweens.add({
      targets: this.messageContainer,
      alpha: 0,
      delay: 1100,
      duration: 500,
      onComplete: () => this.hideMessage()
    });
  }

  hideMessage() {
    this.messageContainer.setVisible(false);
    this.messageContainer.setActive(false);
    this.messageContainer.setAlpha(1);
  }

  updateUI() {
    const collectorCounts = this.getCollectorCounts();

    this.energyText.setText(`星能：${Math.floor(this.starEnergy)} / ${this.maxStarEnergy}`);
    this.hpText.setText(`星球生命：${this.planetHp} / 100`);
    this.waveText.setText(this.getWaveText());
    this.frontlineText.setText(
      `${this.getFrontlineLabel()}采集器：当前 ${collectorCounts.current}  远端 ${collectorCounts.stored}  总计 ${collectorCounts.total}`
    );
    this.updateEnergyCapUpgradeButtonState();

    for (const card of this.cards) {
      if (this.starEnergy < card.data.cost && this.selectedCard?.id !== card.data.id) {
        card.bg.setFillStyle(0x111827, 0.55);
      } else if (this.selectedCard?.id !== card.data.id) {
        card.bg.setFillStyle(0x0b1220, 0.98);
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#030712",
  scene: [SceneDemo],

  resolution: Math.min(window.devicePixelRatio || 1, 2),

  render: {
    antialias: true,
    roundPixels: true
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
