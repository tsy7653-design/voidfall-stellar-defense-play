// 拆除返还比例：临时为 0，正式比例等待用户确认。
const DEMOLISH_REFUND_RATE = 0;
const DEMOLISH_DRAG_THRESHOLD = 8;
const ENERGY_CAP_UPGRADE_COST = 10;
const ENERGY_CAP_UPGRADE_AMOUNT = 10;
const ENERGY_CAP_MAX = 100;
const CARD_DRAG_THRESHOLD = 10;
const GAME_VERSION = "v0.10.0";
const BASE_METEOR_DAMAGE = 18;
const METEOR_DAMAGE_PER_LEVEL = 4;
const METEOR_UPGRADE_BASE_COST = 10;
const METEOR_UPGRADE_COST_STEP = 5;
const METEOR_UPGRADE_MAX_COST = 90;
const METEOR_UPGRADE_CLICK_GUARD_MS = 160;

// 固定 UI 只提升视觉清晰度，不改变卡牌与按钮的交互尺寸。
const UI_VISUAL_SCALE = {
  cardThumbnail: 0.108,
  meteorThumbnail: 0.132,
  hudIcon: 0.112,
  energyUpgradeIcon: 0.072,
  demolishIcon: 0.11
};

// UI 视觉规范：只统一布局、层级和颜色，不参与任何战斗或数值计算。
const UI_THEME = {
  hud: {
    backdropFill: 0x020713,
    backdropAlpha: 0.38,
    panelFill: 0x07172b,
    panelAlternateFill: 0x0b1730,
    panelAlpha: 0.9,
    border: 0x24b9ee,
    separator: 0x164464,
    iconWell: 0x08223b,
    label: "#a9c4dc",
    value: "#f4f9ff",
    muted: "#bfd1e4",
    energy: "#ffd166",
    healthy: "#68e7a2"
  },
  card: {
    barFill: 0x020711,
    tacticalFill: 0x130b2b,
    fill: 0x061323,
    headerFill: 0x0a2037,
    imageFill: 0x07192d,
    footerFill: 0x030d1a,
    hoverFill: 0x0a2138,
    hoverImageFill: 0x0b2944,
    selectedImageFill: 0x0d304d,
    unavailableFill: 0x080d17,
    unavailableImageFill: 0x0a101a,
    border: 0x315a78,
    hoverBorder: 0x70dfff,
    selectedBorder: 0x62e8ff,
    selectedFill: 0x0d2a44,
    meteorFill: 0x241006,
    meteorImageFill: 0x321306,
    meteorSelectedFill: 0x3a1807,
    meteorSelectedImageFill: 0x4a1b06,
    meteorBorder: 0xf59e0b,
    meteorGlow: 0xfb923c,
    title: "#e6f2ff",
    meta: "#9eb6cc",
    cost: "#ffd166",
    unavailableCost: "#ff9b75"
  },
  panel: {
    overlayAlpha: 0.78,
    fill: 0x050b1b,
    headerFill: 0x111a3a,
    statsFill: 0x071e35,
    border: 0x38c7f4,
    divider: 0x2477a9,
    buttonFill: 0x0b4168,
    buttonHoverFill: 0x115d86,
    buttonBorder: 0x6ddcff,
    secondaryFill: 0x2c1a4d,
    secondaryHoverFill: 0x45246f,
    secondaryBorder: 0xc4b5fd,
    title: "#f4f9ff",
    body: "#c7d7e8",
    value: "#e6f4ff",
    victory: "#ffd166",
    danger: "#fb7185"
  },
  message: {
    info: "#dceeff",
    reward: "#ffd166",
    warning: "#ffb25c",
    danger: "#ff6b6b",
    alpha: 0.88
  },
  type: {
    hudLabel: "13px",
    hudValue: "18px",
    hudMeta: "13px",
    cardTitle: "16px",
    cardMeta: "14px",
    message: "30px",
    panelTitle: "30px",
    panelBody: "17px",
    panelValue: "19px",
    button: "19px"
  }
};

const UI_LAYOUT = {
  hud: {
    x: 16,
    width: 292,
    rowHeight: 30,
    rows: [23, 57, 91],
    backdropHeight: 104
  },
  card: {
    width: 150,
    height: 100,
    headerHeight: 22,
    imageHeight: 54,
    footerHeight: 22
  },
  rightHud: {
    width: 78,
    height: 104,
    rightInset: 50
  },
  messageYRatio: 0.4
};

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
  breaker: { texture: "enemy_shieldbreaker", scale: 0.08 },
  leaper: { texture: "enemy_leaper", scale: 0.214 },
  ranged: { texture: "enemy_ranged", scale: 0.075 }
};

const GRID_VISUALS = {
  defense: { texture: "tile_defense_grid", tint: null },
  // tile_resource_grid 仍有浅色边缘残留，暂用已批准的同结构格子加青绿色 tint。
  resource: { texture: "tile_defense_grid", tint: 0x34d399 }
};

const GAME_ASSET_PATHS = {
  home_planet_dawnstar: "assets/game/planets/home_planet_dawnstar.png",
  void_portal: "assets/game/portals/void_portal.png",
  building_harvester: "assets/game/buildings/building_harvester.png",
  building_turret: "assets/game/buildings/building_turret.png",
  building_prism: "assets/game/buildings/building_prism.png",
  building_gravity_shield: "assets/game/buildings/building_gravity_shield.png",
  enemy_basic: "assets/game/enemies/enemy_basic.png",
  enemy_fast: "assets/game/enemies/enemy_fast.png",
  enemy_tank: "assets/game/enemies/enemy_tank.png",
  enemy_shieldbreaker: "assets/game/enemies/enemy_shieldbreaker.png",
  enemy_ranged: "assets/game/enemies/enemy_ranged.png",
  enemy_leaper: "assets/game/enemies/enemy_leaper.png",
  icon_star_energy: "assets/game/ui/icon_star_energy.png",
  icon_planet_hp: "assets/game/ui/icon_planet_hp.png",
  icon_wave: "assets/game/ui/icon_wave.png",
  icon_meteor_strike: "assets/game/ui/icon_meteor_strike.png",
  icon_demolish: "assets/game/ui/icon_demolish.png",
  icon_energy_upgrade: "assets/game/ui/icon_energy_upgrade.png",
  bg_space_battlefield_hd: "assets/game/backgrounds/bg_space_battlefield_hd.png",
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

  // 顶部 HUD 使用更小内边距，避免在紧凑模块中挤出边框。
  makeHudText(x, y, content, style = {}) {
    const text = this.makeText(x, y, content, style);
    text.setPadding(0, 2, 0, 2);
    return text;
  }

  setTextIfChanged(textObject, value) {
    if (!textObject) return false;
    const nextValue = String(value);
    if (textObject.text === nextValue) return false;
    textObject.setText(nextValue);
    return true;
  }

  addToFrontline(item) {
    this.frontlineLayer.add(item);
    return item;
  }

  makeFrontlineText(x, y, content, style = {}) {
    return this.addToFrontline(this.makeText(x, y, content, style));
  }

  addSceneAmbientTween(config) {
    const tween = this.tweens.add(config);
    this.sceneAmbientTweens ??= [];
    this.sceneAmbientTweens.push(tween);
    return tween;
  }

  setManagedTweenPaused(tween, paused) {
    if (!tween) return;
    if (paused) tween.pause?.();
    else tween.resume?.();
  }

  stopManagedTween(tween) {
    if (!tween) return;
    tween.stop?.();
    tween.remove?.();
  }

  cleanupSceneAnimations() {
    for (const tween of this.sceneAmbientTweens || []) this.stopManagedTween(tween);
    this.sceneAmbientTweens = [];

    for (const building of this.buildings || []) {
      this.stopManagedTween(building.ambientTween);
      this.stopManagedTween(building.feedbackTween);
      building.ambientTween = null;
      building.feedbackTween = null;
    }

    for (const shield of this.shields || []) {
      this.stopManagedTween(shield.ambientTween);
      shield.ambientTween = null;
    }

    this.clearSupplyVisuals();
  }

  preload() {
    for (const [key, path] of Object.entries(GAME_ASSET_PATHS)) {
      this.load.image(key, path);
    }
  }

  hasTexture(key) {
    return Boolean(this.textures?.exists?.(key));
  }

  resetRunStats() {
    this.runStats = {
      highestWaveReached: 0,
      completedWaves: 0,
      totalKills: 0,
      killsByType: {
        basic: 0,
        fast: 0,
        tank: 0,
        ranged: 0,
        breaker: 0,
        leaper: 0
      }
    };
  }

  resetMeteorProgress() {
    this.baseMeteorDamage = BASE_METEOR_DAMAGE;
    this.meteorLevel = 1;
    this.meteorDamage = this.getMeteorDamage(this.meteorLevel);
    this.meteorUpgradeBlockedUntil = 0;
  }

  getMeteorDamage(level = this.meteorLevel) {
    const normalizedLevel = Math.max(1, Math.floor(level || 1));
    return (this.baseMeteorDamage ?? BASE_METEOR_DAMAGE) + (normalizedLevel - 1) * METEOR_DAMAGE_PER_LEVEL;
  }

  getMeteorUpgradeCost(currentLevel = this.meteorLevel) {
    const normalizedLevel = Math.max(1, Math.floor(currentLevel || 1));
    return Math.min(
      METEOR_UPGRADE_MAX_COST,
      METEOR_UPGRADE_BASE_COST + (normalizedLevel - 1) * METEOR_UPGRADE_COST_STEP
    );
  }

  upgradeMeteor() {
    if (this.gameState !== "playing") return false;

    const now = this.time?.now ?? Date.now();
    if (now < (this.meteorUpgradeBlockedUntil || 0)) return false;

    const cost = this.getMeteorUpgradeCost();
    if (this.starEnergy < cost) {
      this.showMessage("星能不足", "warning");
      return false;
    }

    this.meteorUpgradeBlockedUntil = now + METEOR_UPGRADE_CLICK_GUARD_MS;
    this.starEnergy -= cost;
    this.meteorLevel++;
    this.meteorDamage = this.getMeteorDamage(this.meteorLevel);
    this.updateUI();
    this.showMessage(`陨星打击 Lv${this.meteorLevel}`, "reward");
    return true;
  }

  resetSupplyState() {
    this.clearSupplyVisuals();
    this.firstLeftWingSupplyDelivered = false;
    this.firstLeftWingSupplyStartWave = 0;
    this.periodicSupplyWaves = new Set();
    this.supplyCount = 0;
    this.totalSupplyDelivered = 0;
    this.supplyVisuals = [];
    this.waveCompletionPending = false;
  }

  clearSupplyVisuals() {
    for (const visual of this.supplyVisuals || []) {
      this.tweens?.killTweensOf?.(visual);
      visual?.destroy?.();
    }
    this.supplyVisuals = [];
  }

  recordEnemyKill(enemy) {
    if (!enemy || enemy.killCounted || !this.runStats) return false;

    const enemyType = enemy.type;

    if (!(enemyType in this.runStats.killsByType)) return false;

    enemy.killCounted = true;
    this.runStats.totalKills++;
    this.runStats.killsByType[enemyType]++;
    return true;
  }

  getSurvivingBuildingSummary() {
    const summary = {
      collector: {},
      turret: {},
      prism: {},
      shield: {}
    };
    const addLevel = (type, level) => {
      const normalizedLevel = Math.max(1, level || 1);
      summary[type][normalizedLevel] = (summary[type][normalizedLevel] || 0) + 1;
    };

    for (const building of this.buildings) {
      if (building.destroyed || !this.isBuildingRegistered(building)) continue;

      if (building.id === "collector") {
        addLevel("collector", building.collectLevel);
      } else if (building.id === "turret") {
        addLevel("turret", building.defenseLevel);
      } else if (building.id === "laser") {
        addLevel("prism", building.defenseLevel);
      }
    }

    for (const shield of this.shields) {
      if (shield.destroyed || !this.isShieldRegistered(shield)) continue;
      addLevel("shield", shield.shieldLevel);
    }

    return summary;
  }

  getRunSummary() {
    return {
      highestWaveReached: this.runStats.highestWaveReached,
      completedWaves: this.runStats.completedWaves,
      totalKills: this.runStats.totalKills,
      killsByType: { ...this.runStats.killsByType },
      survivingBuildings: this.getSurvivingBuildingSummary()
    };
  }

  formatFinalDefenseLines(survivingBuildings) {
    const buildingTypes = [
      ["collector", "星尘采集器"],
      ["turret", "星轨炮台"],
      ["prism", "光棱卫星"],
      ["shield", "引力护盾"]
    ];

    return buildingTypes.flatMap(([type, label]) => {
      const levels = Object.entries(survivingBuildings[type] || {})
        .map(([level, count]) => [Number(level), count])
        .filter(([, count]) => count > 0)
        .sort(([leftLevel], [rightLevel]) => leftLevel - rightLevel);

      if (levels.length === 0) return [];

      const levelText = levels
        .map(([level, count]) => `Lv.${level} × ${count}`)
        .join("，");
      return [`${label}：${levelText}`];
    });
  }

  triggerGameOver() {
    if (this.isGameOver || this.gameState !== "playing") return false;

    this.isGameOver = true;
    this.gameState = "lost";
    this.planetHp = 0;
    this.waveActive = false;
    this.waveSpawnTimer = 0;
    this.waveStartTimer = 0;
    this.waveQueue = [];
    this.frontlineTransitioning = false;
    this.gameOverSummary = this.getRunSummary();

    this.cancelPendingMapAction();
    this.cancelCardDrag();
    this.clearCardSelection();
    this.demolishMode = false;
    this.updateDemolishButtonState();
    this.updateMeteorPreview(this.input.activePointer);
    this.hideMessage();
    this.tweens.pauseAll?.();
    this.updateUI();
    this.showGameOverScreen();
    return true;
  }

  showGameOverScreen() {
    return this.showEndScreen({ result: "defeat", summary: this.gameOverSummary });
  }

  showVictoryScreen() {
    return this.showEndScreen({ result: "victory", summary: this.gameEndSummary });
  }

  showEndScreen({ result, summary }) {
    if (this.endScreenUi || !summary) return false;

    const isVictory = result === "victory";
    const defenseLines = this.formatFinalDefenseLines(summary.survivingBuildings);
    const panelWidth = Math.min(620, this.W * 0.82);
    const panelHeight = Math.min(this.H - 80, 330 + defenseLines.length * 27);
    const panelX = this.W / 2;
    const panelY = this.H / 2;
    const panelTop = panelY - panelHeight / 2;
    const overlay = this.add.rectangle(panelX, panelY, this.W, this.H, 0x020617, UI_THEME.panel.overlayAlpha);
    overlay.setDepth(200);
    overlay.setInteractive();
    overlay.on("pointerdown", () => this.beginFixedUiInteraction());

    const panel = this.add.rectangle(panelX, panelY, panelWidth, panelHeight, UI_THEME.panel.fill, 0.97);
    panel.setStrokeStyle(1, UI_THEME.panel.border, 0.74);
    panel.setDepth(201);
    const panelHeaderBand = this.add.rectangle(panelX, panelTop + 44, panelWidth - 2, 72, UI_THEME.panel.headerFill, 0.58);
    panelHeaderBand.setDepth(201);
    const statsBand = this.add.rectangle(panelX, panelTop + 140, panelWidth - 72, 46, UI_THEME.panel.statsFill, 0.9);
    statsBand.setStrokeStyle(1, UI_THEME.panel.divider, 0.34);
    statsBand.setDepth(201);
    const panelAccent = this.add.rectangle(
      panelX,
      panelTop + 8,
      panelWidth - 72,
      2,
      isVictory ? UI_THEME.panel.victory : UI_THEME.panel.danger,
      0.86
    );
    panelAccent.setDepth(202);

    const addPanelText = (x, y, content, style) => {
      const text = this.makeText(x, y, content, style);
      text.setDepth(202);
      return text;
    };

    const title = addPanelText(panelX, panelTop + 28, isVictory ? "恭喜你成功守护晨曦星" : "晨曦星失守", {
      fontSize: UI_THEME.type.panelTitle,
      color: isVictory ? UI_THEME.panel.victory : UI_THEME.panel.danger,
      fontStyle: "bold"
    });
    title.setOrigin(0.5, 0);

    const subtitle = addPanelText(panelX, panelTop + 76, isVictory
      ? "虚空潮汐暂时退去，晨曦星迎来了新的黎明。"
      : "虚空潮汐突破了最后防线", {
      fontSize: UI_THEME.type.panelBody,
      color: UI_THEME.panel.body
    });
    subtitle.setOrigin(0.5, 0);

    const statLines = isVictory ? [
      `完成波数：${summary.completedWaves}`,
      `击败怪物：${summary.totalKills}`
    ] : [
      `到达波数：${summary.highestWaveReached}`,
      `完成波数：${summary.completedWaves}`,
      `击败怪物：${summary.totalKills}`
    ];
    const stats = addPanelText(panelX, panelTop + 122, statLines.join("   "), {
      fontSize: UI_THEME.type.panelValue,
      color: UI_THEME.panel.value,
      fontStyle: "bold"
    });
    stats.setOrigin(0.5, 0);

    const divider = this.add.rectangle(panelX, panelTop + 173, panelWidth - 76, 1, UI_THEME.panel.divider, 0.7);
    divider.setDepth(202);

    const defenseHeader = addPanelText(panelX - panelWidth / 2 + 38, panelTop + 190, "最终防线", {
      fontSize: "18px",
      color: "#8edfff",
      fontStyle: "bold"
    });

    if (defenseLines.length === 0) {
      const emptyLine = addPanelText(panelX, panelTop + 224, isVictory
        ? "最终防线：防线虽已耗尽，但晨曦星成功获救"
        : "最终防线：已全数失守", {
        fontSize: UI_THEME.type.panelBody,
        color: UI_THEME.panel.body
      });
      emptyLine.setOrigin(0.5, 0);
    } else {
      defenseLines.forEach((line, index) => {
        addPanelText(panelX - panelWidth / 2 + 42, panelTop + 220 + index * 27, line, {
          fontSize: "16px",
          color: UI_THEME.panel.value
        });
      });
    }

    const restartButton = this.add.rectangle(panelX, panelTop + panelHeight - 43, 250, 56, UI_THEME.panel.buttonFill, 0.98);
    restartButton.setStrokeStyle(1, UI_THEME.panel.buttonBorder, 0.94);
    restartButton.setDepth(202);
    restartButton.setInteractive({ useHandCursor: true });

    const restartLabel = addPanelText(panelX, panelTop + panelHeight - 44, "再来一次", {
      fontSize: UI_THEME.type.button,
      color: UI_THEME.panel.value,
      fontStyle: "bold"
    });
    restartLabel.setOrigin(0.5, 0.5);

    restartButton.on("pointerover", () => {
      if (!this.restartRequested) {
        restartButton.setFillStyle(UI_THEME.panel.buttonHoverFill, 1);
        restartButton.setStrokeStyle(2, 0xe0f7ff, 1);
      }
    });
    restartButton.on("pointerout", () => {
      if (!this.restartRequested) {
        restartButton.setFillStyle(UI_THEME.panel.buttonFill, 0.98);
        restartButton.setStrokeStyle(1, UI_THEME.panel.buttonBorder, 0.94);
      }
    });
    restartButton.on("pointerdown", () => {
      this.beginFixedUiInteraction();
      this.restartGame();
    });

    const ui = { overlay, panel, panelHeaderBand, statsBand, panelAccent, restartButton, restartLabel, result };
    this.endScreenUi = ui;
    if (!isVictory) this.gameOverUi = ui;
    return true;
  }

  restartGame() {
    if ((!this.isGameOver && this.gameState !== "won") || this.restartRequested || !this.scene?.restart) return false;

    this.restartRequested = true;
    this.endScreenUi?.restartButton?.disableInteractive?.();
    this.gameOverUi?.restartButton?.disableInteractive?.();
    this.clearSupplyVisuals();
    this.scene.restart();
    return true;
  }

  shouldShowStageChoice(completedWave) {
    return (
      this.gameState === "playing" &&
      !this.isGameOver &&
      completedWave >= 30 &&
      completedWave % 10 === 0 &&
      !this.stageChoiceWaves.has(completedWave)
    );
  }

  destroyStageChoiceScreen() {
    const elements = this.stageChoiceUi?.elements || [];
    for (const element of elements) element?.destroy?.();
    this.stageChoiceUi = null;
  }

  showStageChoiceScreen(completedWave) {
    if (!this.shouldShowStageChoice(completedWave) || this.stageChoiceActive) return false;

    this.stageChoiceActive = true;
    this.stageChoiceResolved = false;
    this.stageChoiceWave = completedWave;
    this.stageChoiceWaves.add(completedWave);
    this.gameState = "stage_choice";
    this.waveActive = false;
    this.waveSpawnTimer = 0;
    this.waveStartTimer = 0;
    this.cancelPendingMapAction();
    this.cancelCardDrag();
    this.clearCardSelection();
    this.demolishMode = false;
    this.updateDemolishButtonState();
    this.updateMeteorPreview(this.input.activePointer);
    this.tweens.pauseAll?.();

    const panelWidth = Math.min(610, this.W * 0.82);
    const panelHeight = 330;
    const panelX = this.W / 2;
    const panelY = this.H / 2;
    const panelTop = panelY - panelHeight / 2;
    const elements = [];
    const track = (element) => {
      elements.push(element);
      return element;
    };
    const overlay = track(this.add.rectangle(panelX, panelY, this.W, this.H, 0x020617, UI_THEME.panel.overlayAlpha));
    overlay.setDepth(180);
    overlay.setInteractive();
    overlay.on("pointerdown", () => this.beginFixedUiInteraction());

    const panel = track(this.add.rectangle(panelX, panelY, panelWidth, panelHeight, UI_THEME.panel.fill, 0.97));
    panel.setStrokeStyle(1, UI_THEME.panel.border, 0.74);
    panel.setDepth(181);
    const panelHeaderBand = track(this.add.rectangle(panelX, panelTop + 44, panelWidth - 2, 72, UI_THEME.panel.headerFill, 0.58));
    panelHeaderBand.setDepth(181);
    const statsBand = track(this.add.rectangle(panelX, panelTop + 168, panelWidth - 72, 46, UI_THEME.panel.statsFill, 0.9));
    statsBand.setStrokeStyle(1, UI_THEME.panel.divider, 0.34);
    statsBand.setDepth(181);
    const panelAccent = track(this.add.rectangle(panelX, panelTop + 8, panelWidth - 72, 2, UI_THEME.panel.victory, 0.86));
    panelAccent.setDepth(182);

    const addPanelText = (x, y, content, style) => {
      const text = track(this.makeText(x, y, content, style));
      text.setDepth(182);
      return text;
    };

    const title = addPanelText(panelX, panelTop + 30, "阶段守护完成", {
      fontSize: UI_THEME.type.panelTitle,
      color: UI_THEME.panel.victory,
      fontStyle: "bold"
    });
    title.setOrigin(0.5, 0);

    const copy = addPanelText(panelX, panelTop + 82, "晨曦星暂时恢复了平静。\n你可以结束本次守护，也可以继续迎战更强的虚空潮汐。", {
      fontSize: UI_THEME.type.panelBody,
      color: UI_THEME.panel.body,
      align: "center",
      lineSpacing: 8
    });
    copy.setOrigin(0.5, 0);

    const stats = addPanelText(panelX, panelTop + 156, `已完成波数：${completedWave}    当前击败怪物：${this.runStats.totalKills}`, {
      fontSize: UI_THEME.type.panelValue,
      color: UI_THEME.panel.value,
      fontStyle: "bold"
    });
    stats.setOrigin(0.5, 0);

    const createButton = (x, color, hoverColor, borderColor, label, handler) => {
      const button = track(this.add.rectangle(x, panelTop + panelHeight - 58, 220, 54, color, 0.98));
      button.setStrokeStyle(1, borderColor, 0.94);
      button.setDepth(182);
      button.setInteractive({ useHandCursor: true });
      const buttonLabel = addPanelText(x, panelTop + panelHeight - 59, label, {
        fontSize: UI_THEME.type.button,
        color: UI_THEME.panel.value,
        fontStyle: "bold"
      });
      buttonLabel.setOrigin(0.5, 0.5);
      button.on("pointerover", () => {
        button.setFillStyle(hoverColor, 1);
        button.setStrokeStyle(2, borderColor, 1);
      });
      button.on("pointerout", () => {
        button.setFillStyle(color, 0.98);
        button.setStrokeStyle(1, borderColor, 0.94);
      });
      button.on("pointerdown", () => {
        this.beginFixedUiInteraction();
        handler();
      });
      return button;
    };

    const continueButton = createButton(
      panelX - 122,
      UI_THEME.panel.buttonFill,
      UI_THEME.panel.buttonHoverFill,
      UI_THEME.panel.buttonBorder,
      "继续守护",
      () => this.continueStageGuard()
    );
    const endButton = createButton(
      panelX + 122,
      UI_THEME.panel.secondaryFill,
      UI_THEME.panel.secondaryHoverFill,
      UI_THEME.panel.secondaryBorder,
      "结束本局",
      () => this.endRunFromStageChoice()
    );
    this.stageChoiceUi = { elements, overlay, panel, continueButton, endButton };
    this.updateUI();
    return true;
  }

  advanceAfterCompletedWave(completedWave) {
    if (this.gameState !== "playing") return false;

    this.waveSpawned = 0;
    this.waveQueue = [];
    this.waveStartTimer = this.waveRestTime;

    if (completedWave % this.wavesPerFrontline === 0) {
      this.switchFrontline(completedWave);
    } else {
      this.showMessage(`第 ${completedWave} 波清除`);
    }

    return true;
  }

  getPeriodicSupplyAmount() {
    return Math.floor(this.maxStarEnergy * 0.4);
  }

  shouldDeliverPeriodicSupply(completedWave) {
    return (
      this.gameState === "playing" &&
      this.firstLeftWingSupplyDelivered &&
      completedWave > this.firstLeftWingSupplyStartWave &&
      completedWave % 5 === 0 &&
      !this.periodicSupplyWaves.has(completedWave)
    );
  }

  grantDawnstarSupply(requestedAmount, label, onComplete = null) {
    const amount = Math.max(0, Math.floor(requestedAmount));
    const actualAmount = Math.max(0, Math.min(amount, this.maxStarEnergy - this.starEnergy));

    this.addStarEnergy(actualAmount);
    this.supplyCount++;
    this.totalSupplyDelivered += actualAmount;
    if (this.messageText && this.messageContainer) {
      this.showMessage(`${label}  +${actualAmount} 星能`, "reward");
    }
    this.playDawnstarSupplyAnimation(label, actualAmount, onComplete);
    return actualAmount;
  }

  deliverFirstLeftWingSupply(onComplete = null) {
    if (this.firstLeftWingSupplyDelivered || this.activeWing !== "left" || this.gameState !== "playing") {
      onComplete?.();
      return false;
    }

    this.firstLeftWingSupplyDelivered = true;
    this.firstLeftWingSupplyStartWave = this.currentWaveIndex + 1;
    this.grantDawnstarSupply(30, "先锋补给", onComplete);
    return true;
  }

  deliverPeriodicSupply(completedWave, onComplete = null) {
    if (!this.shouldDeliverPeriodicSupply(completedWave)) {
      onComplete?.();
      return false;
    }

    this.periodicSupplyWaves.add(completedWave);
    this.grantDawnstarSupply(this.getPeriodicSupplyAmount(), "晨曦星补给", onComplete);
    return true;
  }

  playDawnstarSupplyAnimation(label, amount, onComplete = null) {
    const finish = (() => {
      let finished = false;
      return () => {
        if (finished) return;
        finished = true;
        this.clearSupplyVisuals();
        onComplete?.();
      };
    })();

    if (!this.add || !this.tweens?.add) {
      finish();
      return;
    }

    const sourceX = this.planetX + (this.enemyDirection < 0 ? 54 : -54);
    const sourceY = this.planetY - 8;
    const targetX = this.energyText?.x || 320;
    const targetY = 42;
    const pod = this.addToFrontline(this.add.rectangle(sourceX, sourceY, 18, 14, 0x93c5fd, 0.98));
    const core = this.addToFrontline(this.add.circle(sourceX, sourceY, 5, 0xfef3c7, 0.98));
    const trail = this.addToFrontline(this.add.circle(sourceX, sourceY, 12, 0x60a5fa, 0.22));

    pod.setStrokeStyle(2, 0xdbeafe, 0.95).setDepth(96);
    core.setDepth(97);
    trail.setDepth(95);
    this.supplyVisuals = [pod, core, trail];

    this.tweens.add({
      targets: [pod, core, trail],
      x: targetX,
      y: targetY,
      duration: 820,
      ease: "Cubic.easeInOut",
      onComplete: () => {
        const burst = this.add.circle(targetX, targetY, 14, 0x93c5fd, 0.55).setDepth(98);
        this.supplyVisuals.push(burst);
        this.floatText(targetX, targetY + 18, `${label}  +${amount} 星能`, "#dbeafe");
        this.tweens.add({
          targets: burst,
          scale: 2.2,
          alpha: 0,
          duration: 260,
          onComplete: finish
        });
      }
    });
  }

  processCompletedWave(completedWave) {
    const continueAfterSupply = () => {
      if (this.gameState !== "playing") return;
      this.waveCompletionPending = false;
      if (this.shouldShowStageChoice(completedWave)) {
        this.showStageChoiceScreen(completedWave);
      } else {
        this.advanceAfterCompletedWave(completedWave);
      }
    };

    this.waveCompletionPending = true;
    this.deliverPeriodicSupply(completedWave, continueAfterSupply);
  }

  continueStageGuard() {
    if (!this.stageChoiceActive || this.stageChoiceResolved || this.gameState !== "stage_choice") return false;

    const completedWave = this.stageChoiceWave;
    this.stageChoiceResolved = true;
    this.stageChoiceActive = false;
    this.destroyStageChoiceScreen();
    this.tweens.resumeAll?.();
    this.syncWingAnimationState();
    this.gameState = "playing";
    this.advanceAfterCompletedWave(completedWave);
    this.updateUI();
    return true;
  }

  endRunFromStageChoice() {
    if (!this.stageChoiceActive || this.stageChoiceResolved || this.gameState !== "stage_choice") return false;

    this.stageChoiceResolved = true;
    this.stageChoiceActive = false;
    this.destroyStageChoiceScreen();
    this.gameEndSummary = this.getRunSummary();
    this.gameState = "won";
    this.waveActive = false;
    this.waveSpawnTimer = 0;
    this.waveStartTimer = 0;
    this.waveQueue = [];
    this.cancelPendingMapAction();
    this.cancelCardDrag();
    this.clearCardSelection();
    this.demolishMode = false;
    this.updateDemolishButtonState();
    this.updateMeteorPreview(this.input.activePointer);
    this.hideMessage();
    this.updateUI();
    this.showVictoryScreen();
    return true;
  }

  create() {
    this.cameras.main.setRoundPixels(true);

    this.W = this.scale.width;
    this.H = this.scale.height;
    this.sceneAmbientTweens = [];
    this.events?.once?.(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanupSceneAnimations());

    // 星能系统
    this.starEnergy = 10;
    this.maxStarEnergy = 50;
    this.energyRegen = 1;
    this.energyRegenInterval = 5;
    this.energyRegenTimer = 0;

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
    this.activeWing = "right";
    this.wingStates = this.createWingStates();
    this.resetRunStats();
    this.resetSupplyState();
    this.isGameOver = false;
    this.gameOverSummary = null;
    this.gameOverUi = null;
    this.endScreenUi = null;
    this.restartRequested = false;
    this.stageChoiceActive = false;
    this.stageChoiceResolved = false;
    this.stageChoiceWave = 0;
    this.stageChoiceWaves = new Set();
    this.stageChoiceUi = null;
    this.gameEndSummary = null;
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

    // 建筑无限升级配置：属性和费用均由统一计算接口生成，不维护独立升级计时器。
    this.buildingProgressionConfig = {
      collector: {
        amount: 1,
        intervalFloor: 2.5,
        intervalBase: 10,
        intervalDecay: 0.92,
        costBase: 6,
        costStep: 3,
        costCap: 90,
        color: 0x22c55e,
        textColor: "#86efac"
      },
      turret: {
        baseStats: {
          1: { damage: 4, cooldown: 0.95, range: 250, color: 0x38bdf8, textColor: "#bae6fd" },
          2: { damage: 6, cooldown: 0.82, range: 285, color: 0x0ea5e9, textColor: "#7dd3fc" },
          3: { damage: 8, cooldown: 0.72, range: 320, color: 0x60a5fa, textColor: "#dbeafe" }
        },
        cooldownFloor: 0.4,
        costCap: 90
      },
      laser: {
        baseStats: {
          1: { damage: 9, cooldown: 1.45, range: 560, color: 0xfacc15, textColor: "#fde68a" },
          2: { damage: 13, cooldown: 1.3, range: 600, color: 0xf97316, textColor: "#fed7aa" },
          3: { damage: 17, cooldown: 1.15, range: 640, color: 0xfef3c7, textColor: "#fef9c3" }
        },
        cooldownFloor: 0.65,
        costCap: 95
      },
      shield: {
        baseStats: {
          1: { maxHp: 24, color: 0x93c5fd, textColor: "#dbeafe" },
          2: { maxHp: 36, color: 0x38bdf8, textColor: "#bae6fd" },
          3: { maxHp: 50, color: 0xfacc15, textColor: "#fde68a" }
        },
        costCap: 90
      }
    };

    // 建筑与护盾耐久集中配置；当前均为临时测试值，等待后续平衡阶段调整。
    this.durabilityConfig = {
      building: {
        collector: { maxHp: 40, collisionHalfWidth: 22 },
        turret: { maxHp: 60, collisionHalfWidth: 22 },
        laser: { maxHp: 50, collisionHalfWidth: 22 }
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
    this.resetMeteorProgress();
    this.meteorPreviewOuter = null;
    this.meteorPreviewInner = null;

    // 无尽波次：每 10 波切换一次左右战区，敌人血量随波次持续叠加。
    this.currentWaveIndex = 0;
    this.waveSpawned = 0;
    this.waveQueue = [];
    this.waveActive = false;
    this.waveStartTimer = 2.5;
    this.waveSpawnTimer = 0;
    this.waveRestTime = 4;
    this.wavesPerFrontline = 10;
    this.frontlineIndex = 1;
    this.enemyDirection = -1;
    this.waveTemplates = [
      { count: 3, interval: 2.8, hp: 14, speed: 40, damage: 10, reward: 0 },
      { count: 4, interval: 2.7, hp: 16, speed: 41, damage: 10, reward: 0 },
      { count: 4, interval: 2.6, hp: 19, speed: 42, damage: 11, reward: 0 },
      { count: 5, interval: 2.5, hp: 22, speed: 43, damage: 11, reward: 0 },
      { count: 5, interval: 2.4, hp: 25, speed: 44, damage: 12, reward: 0 },
      { count: 6, interval: 2.3, hp: 29, speed: 45, damage: 12, reward: 0 },
      { count: 6, interval: 2.2, hp: 33, speed: 46, damage: 13, reward: 0 },
      { count: 7, interval: 2.1, hp: 37, speed: 48, damage: 13, reward: 0 },
      { count: 7, interval: 2.0, hp: 42, speed: 49, damage: 14, reward: 0 },
      { count: 8, interval: 1.9, hp: 48, speed: 50, damage: 14, reward: 0 }
    ];
    this.wavePressureConfig = {
      countBonusesByDecade: [0, 4, 8, 13, 19, 26, 34, 43],
      extraCountBonusPerDecade: 9,
      spawnIntervalMultipliers: [1, 0.85, 0.72, 0.62, 0.55, 0.5],
      minimumSpawnInterval: 0.8
    };
    this.enemySpawnConfig = {
      basic: {
        hpMultiplier: 1,
        speedMultiplier: 1,
        damageMultiplier: 1,
        killReward: 0
      },
      fast: {
        hpMultiplier: 0.7,
        speedMultiplier: 1.8,
        damageMultiplier: 1,
        killReward: 0
      },
      tank: {
        hpMultiplier: 2.5,
        speedMultiplier: 0.6,
        damageMultiplier: 1.4,
        killReward: 1
      },
      breaker: {
        hpMultiplier: 1.3,
        speedMultiplier: 0.9,
        damageMultiplier: 1.1,
        attackCooldown: 1,
        shieldDamageMultiplier: 2.5,
        killReward: 1,
        minWave: 17,
        waveRatio: 0.1
      },
      leaper: {
        hpMultiplier: 0.8,
        speedMultiplier: 1.25,
        damageMultiplier: 1,
        attackCooldown: 1,
        killReward: 1,
        minWave: 21,
        waveRatio: 0.1
      },
      ranged: {
        hpMultiplier: 0.9,
        speedMultiplier: 0.75,
        damageMultiplier: 1,
        attackCooldown: 1.4,
        attackRange: 150,
        killReward: 1,
        minWave: 13,
        waveRatio: 0.1
      },
      waveCompositions: [
        { maxWave: 5, basic: 1, fast: 0, tank: 0 },
        { maxWave: 8, basic: 0.85, fast: 0.15, tank: 0 },
        { maxWave: 10, basic: 0.65, fast: 0.25, tank: 0.1 },
        { maxWave: 12, basic: 0.5, fast: 0.3, tank: 0.2 },
        { maxWave: 16, basic: 0.45, fast: 0.25, tank: 0.2, ranged: 0.1 },
        { maxWave: 20, basic: 0.35, fast: 0.2, tank: 0.25, ranged: 0.1, breaker: 0.1 },
        { maxWave: Infinity, basic: 0.3, fast: 0.2, tank: 0.2, ranged: 0.1, breaker: 0.1, leaper: 0.1 }
      ],
      specialRotation: ["ranged", "breaker", "leaper"]
    };

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

    this.updateStarEnergy(dt);
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

    const fallbackBackground = this.add.rectangle(W / 2, H / 2, W, H, 0x030712);
    fallbackBackground.setDepth(-1000);

    if (this.hasTexture("bg_space_battlefield_hd")) {
      const source = this.textures.get("bg_space_battlefield_hd").getSourceImage();
      const coverScale = Math.max(W / source.width, H / source.height);

      this.battlefieldBackground = this.add.image(W / 2, H / 2, "bg_space_battlefield_hd");
      this.battlefieldBackground.setScale(coverScale);
      this.battlefieldBackground.setAlpha(1);
      this.battlefieldBackground.setDepth(-999);
    }

    this.backgroundShade = this.add.rectangle(W / 2, H / 2, W, H, 0x020617, 0.08);
    this.backgroundShade.setDepth(-998);

    // 正式背景已经包含星云和星点，只保留少量轻微前景星尘。
    for (let i = 0; i < 28; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H - 120);
      const radius = Phaser.Math.FloatBetween(0.6, 1.4);
      const alpha = Phaser.Math.FloatBetween(0.12, 0.34);
      const star = this.add.circle(x, y, radius, 0xe5e7eb, alpha);
      star.setDepth(-997);
    }
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

    // HUD 已承接顶部信息，标题不再占用战场视野。
    this.titleText.setVisible(false);
    this.subtitleText.setVisible(false);
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

    if (this.hasTexture("home_planet_dawnstar")) {
      // 正式主体保持静止，外围光晕单独提供轻微能量变化。
      keepPlanet(this.add.image(this.planetX, this.planetY, "home_planet_dawnstar").setScale(0.23));
    } else {
      // 正式图片加载失败时保留原有程序绘制晨曦星。
      keepPlanet(this.add.circle(this.planetX, this.planetY, 58, 0x0f3b82, 1));
      keepPlanet(this.add.circle(this.planetX - 8, this.planetY - 8, 52, 0x2563eb, 0.95));
      keepPlanet(this.add.circle(this.planetX - 20, this.planetY - 20, 30, 0x60a5fa, 0.30));
      keepPlanet(this.add.circle(this.planetX + 18, this.planetY + 18, 50, 0x020617, 0.20));

      const planetEdge = keepPlanet(this.add.circle(this.planetX, this.planetY, 60, 0x000000, 0));
      planetEdge.setStrokeStyle(4, 0xbfdbfe, 0.95);
    }

    const orbit1 = keepPlanet(this.add.ellipse(this.planetX, this.planetY, 160, 116));
    orbit1.setStrokeStyle(1, 0x93c5fd, 0.18);

    const orbit2 = keepPlanet(this.add.ellipse(this.planetX, this.planetY, 195, 140));
    orbit2.setStrokeStyle(1, 0x38bdf8, 0.10);

    keepPlanet(this.makeText(this.planetX - 34, this.planetY + 76, "晨曦星", {
      fontSize: "18px",
      color: "#cfe8ff",
      fontStyle: "bold"
    }));

    this.addSceneAmbientTween({
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
    let portalBody = null;

    if (this.hasTexture("void_portal")) {
      // 正式裂隙素材只替换视觉主体，出生点仍然固定使用 portalX / portalY。
      portalBody = keepPortal(this.add.image(this.portalX, this.portalY, "void_portal").setScale(0.20));
    } else {
      // 正式素材加载失败时保留原有程序绘制裂隙。
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

        this.addSceneAmbientTween({
          targets: p,
          alpha: 0.1,
          scale: 1.6,
          duration: Phaser.Math.Between(700, 1500),
          yoyo: true,
          repeat: -1
        });
      }

      this.addSceneAmbientTween({
        targets: portalOuter,
        angle: 360,
        duration: 3200,
        repeat: -1
      });

      this.addSceneAmbientTween({
        targets: portalRing2,
        scale: 1.12,
        alpha: 0.52,
        duration: 900,
        yoyo: true,
        repeat: -1
      });
    }

    keepPortal(this.makeText(this.portalX - 43, this.portalY + 72, "虚空裂隙", {
      fontSize: "18px",
      color: "#f3d5ff"
    }));

    if (portalBody) {
      this.addSceneAmbientTween({
        targets: portalBody,
        angle: -360,
        duration: 12000,
        repeat: -1
      });
    }

    this.addSceneAmbientTween({
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
      0.18
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

        keepField(this.add.rectangle(x + 3, y + 4, this.cellW - 10, this.cellH - 10, 0x000000, 0.16));

        const tileVisual = isLogistics ? GRID_VISUALS.resource : GRID_VISUALS.defense;
        let tile = null;

        if (this.hasTexture(tileVisual.texture)) {
          const frame = this.textures.getFrame(tileVisual.texture);
          const tileScale = frame
            ? Math.min((this.cellW - 14) / frame.width, (this.cellH - 14) / frame.height)
            : 0.11;

          tile = keepField(this.add.image(x, y, tileVisual.texture));
          tile.setScale(tileScale);
          tile.setAlpha(isLogistics ? 0.9 : 0.94);

          if (tileVisual.tint !== null) {
            tile.setTint(tileVisual.tint);
          }
        }

        const fill = isLogistics ? 0x073047 : 0x0b1220;
        const stroke = isLogistics ? 0x00d9ff : 0x48627f;

        const rect = keepField(this.add.rectangle(
          x,
          y,
          this.cellW - 10,
          this.cellH - 10,
          fill,
          isLogistics ? 0.1 : 0.08
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
          tile,
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
            const config = this.getBuildingStats("shield", slot.shield.shieldLevel);
            line.setFillStyle(config.color, 0.78);
            line.setStrokeStyle(2, 0xdbeafe, 0.95);
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
    // 底部保留为一条统一操作栏，卡牌仍使用原有独立 hitArea 和拖拽入口。
    this.cardBarBg = this.add.rectangle(this.W / 2, this.H - 60, this.W, 120, UI_THEME.card.barFill, 0.94);
    this.cardBarBg.setDepth(88);
    this.cardBarTacticalTint = this.add.rectangle(997, this.H - 60, 566, 116, UI_THEME.card.tacticalFill, 0.34);
    this.cardBarTacticalTint.setDepth(88);
    this.cardBarTop = this.add.rectangle(this.W / 2, this.H - 120, this.W, 3, UI_THEME.hud.border, 0.72);
    this.cardBarTop.setDepth(89);
    this.cardBarGlow = this.add.rectangle(this.W / 2, this.H - 117, this.W, 2, 0xa855f7, 0.22);
    this.cardBarGlow.setDepth(89);
    this.cardBarDivider = this.add.rectangle(714, this.H - 60, 2, 100, UI_THEME.card.border, 0.72);
    this.cardBarDivider.setDepth(89);

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

    const cardPositions = [112, 272, 432, 592, 846];
    const cardAccentColors = {
      collector: 0x34d399,
      turret: 0x38bdf8,
      laser: 0xfacc15,
      shield: 0xa78bfa,
      meteor: 0xf97316
    };

    for (let i = 0; i < this.cardData.length; i++) {
      const data = this.cardData[i];
      const x = cardPositions[i];
      const y = this.H - 58;
      const accentColor = cardAccentColors[data.id] || 0x38bdf8;
      const isMeteorCard = data.id === "meteor";

      const shadow = this.add.rectangle(
        x + 4,
        y + 5,
        UI_LAYOUT.card.width,
        UI_LAYOUT.card.height,
        0x000000,
        0.46
      );
      shadow.setDepth(89);

      const bg = this.add.rectangle(x, y, UI_LAYOUT.card.width, UI_LAYOUT.card.height, UI_THEME.card.fill, 0.98);
      bg.setStrokeStyle(1, UI_THEME.card.border, 0.9);
      bg.setInteractive({ useHandCursor: true });
      bg.setDepth(90);

      const headerBand = this.add.rectangle(x, y - 37, 138, UI_LAYOUT.card.headerHeight, UI_THEME.card.headerFill, 0.96);
      headerBand.setDepth(91);
      const imagePanel = this.add.rectangle(x, y + 1, 138, UI_LAYOUT.card.imageHeight, UI_THEME.card.imageFill, 0.96);
      imagePanel.setDepth(91);
      const footerBand = this.add.rectangle(x, y + 39, 138, UI_LAYOUT.card.footerHeight, UI_THEME.card.footerFill, 0.98);
      footerBand.setDepth(91);
      const imageGlow = this.add.circle(isMeteorCard ? x - 24 : x, y + 2, isMeteorCard ? 31 : 25, accentColor, 0.1);
      imageGlow.setDepth(91);
      const accent = this.add.rectangle(x, y - 48, 138, 3, accentColor, 0.72);
      accent.setDepth(93);

      let thumbnail = null;
      if (this.hasTexture(data.texture)) {
        thumbnail = this.add.image(isMeteorCard ? x - 24 : x, y + 1, data.texture);
        thumbnail.setScale(isMeteorCard ? UI_VISUAL_SCALE.meteorThumbnail : UI_VISUAL_SCALE.cardThumbnail);
        thumbnail.setDepth(92);
      }

      const title = this.makeHudText(isMeteorCard ? x - 17 : x, y - 37, data.name, {
        fontSize: UI_THEME.type.cardTitle,
        color: UI_THEME.card.title,
        fontStyle: "bold",
        shadow: {
          offsetX: 0,
          offsetY: 1,
          color: "#020617",
          blur: 3,
          fill: true
        }
      });
      title.setOrigin(0.5, 0.5);
      title.setDepth(92);

      let costIcon = null;
      if (this.hasTexture("icon_star_energy")) {
        costIcon = this.add.image(x - 16, y + 39, "icon_star_energy");
        costIcon.setScale(UI_VISUAL_SCALE.energyUpgradeIcon * 0.54);
        costIcon.setDepth(92);
      }

      const cost = this.makeHudText(x + (costIcon ? 8 : 0), y + 39, costIcon ? String(data.cost) : `星能 ${data.cost}`, {
        fontSize: UI_THEME.type.cardMeta,
        color: UI_THEME.card.cost,
        fontStyle: "bold"
      });
      cost.setOrigin(0.5, 0.5);
      cost.setDepth(92);

      let levelBadge = null;
      let upgradeButton = null;
      let upgradeText = null;
      if (isMeteorCard) {
        levelBadge = this.makeHudText(x + 47, y - 37, "Lv1", {
          fontSize: "12px",
          color: "#fed7aa",
          fontStyle: "bold"
        });
        levelBadge.setOrigin(0.5, 0.5);
        levelBadge.setDepth(93);

        upgradeButton = this.add.rectangle(x + 40, y + 10, 58, 26, 0x7c2d12, 0.96);
        upgradeButton.setStrokeStyle(1, UI_THEME.card.meteorBorder, 0.9);
        upgradeButton.setInteractive({ useHandCursor: true });
        upgradeButton.setDepth(94);

        upgradeText = this.makeHudText(x + 40, y + 10, "升级 10", {
          fontSize: "12px",
          color: "#ffedd5",
          fontStyle: "bold"
        });
        upgradeText.setOrigin(0.5, 0.5);
        upgradeText.setDepth(95);

        upgradeButton.on("pointerover", () => {
          if (this.starEnergy >= this.getMeteorUpgradeCost()) {
            upgradeButton.setFillStyle(0xc2410c, 1);
            upgradeButton.setStrokeStyle(2, 0xfde68a, 1);
          }
        });
        upgradeButton.on("pointerout", () => this.updateMeteorCardUI(true));
        upgradeButton.on("pointerdown", (pointer, localX, localY, event) => {
          event?.stopPropagation?.();
          this.beginFixedUiInteraction();
          this.cancelCardDrag();
          this.upgradeMeteor();
        });
      }

      const desc = this.makeText(x - 58, y + 35, data.desc, {
        fontSize: "12px",
        color: "#7f98b2"
      });
      desc.setVisible(false);

      const card = {
        data,
        bg,
        title,
        cost,
        desc,
        thumbnail,
        accent,
        accentColor,
        costIcon,
        headerBand,
        imagePanel,
        footerBand,
        imageGlow,
        levelBadge,
        upgradeButton,
        upgradeText
      };

      this.cards.push(card);
      if (isMeteorCard) this.meteorCard = card;
      this.applyCardVisualState(card, "normal");

      bg.on("pointerover", () => {
        if (this.selectedCard?.id !== data.id) {
          this.applyCardVisualState(card, "hover");
        }
      });

      bg.on("pointerout", () => {
        if (this.selectedCard?.id !== data.id) {
          bg.setStrokeStyle(1, UI_THEME.card.border, 0.9);
          this.updateUI();
        }
      });

      bg.on("pointerdown", (pointer) => {
        this.beginCardDragCandidate(data, pointer);
      });
    }
  }

  createUI() {
    const hudX = UI_LAYOUT.hud.x;
    const hudWidth = UI_LAYOUT.hud.width;
    const hudRows = UI_LAYOUT.hud.rows;

    this.statusBarBg = this.add.rectangle(
      hudX + hudWidth / 2,
      hudRows[1],
      hudWidth + 4,
      UI_LAYOUT.hud.backdropHeight,
      UI_THEME.hud.backdropFill,
      UI_THEME.hud.backdropAlpha
    );
    this.statusBarBg.setDepth(90);
    this.statusBarDivider = this.add.rectangle(hudX + 2, hudRows[1], 2, 94, UI_THEME.hud.border, 0.82);
    this.statusBarDivider.setDepth(90);
    this.statusBarTop = this.add.rectangle(hudX + hudWidth / 2, 5, hudWidth - 16, 2, 0xa855f7, 0.34);
    this.statusBarTop.setDepth(90);
    this.hudPanels = hudRows.map((y, index) => {
      const fill = index === 1 ? UI_THEME.hud.panelAlternateFill : UI_THEME.hud.panelFill;
      const panel = this.add.rectangle(
        hudX + hudWidth / 2,
        y,
        hudWidth,
        UI_LAYOUT.hud.rowHeight,
        fill,
        UI_THEME.hud.panelAlpha
      );
      panel.setStrokeStyle(1, UI_THEME.hud.border, 0.38);
      panel.setDepth(90);
      return panel;
    });
    this.hudPanelAccents = hudRows.map((y) => {
      const accent = this.add.rectangle(hudX + hudWidth - 3, y, 3, 18, UI_THEME.hud.border, 0.66);
      accent.setDepth(91);
      return accent;
    });

    const iconX = hudX + 20;
    const hpIconX = hudX + 176;
    const iconWells = [
      [iconX, hudRows[0], 12],
      [iconX, hudRows[1], 12],
      [hpIconX, hudRows[1], 10],
      [iconX, hudRows[2], 12]
    ];
    this.hudIconWells = iconWells.map(([x, y, radius]) => {
      const well = this.add.circle(x, y, radius, UI_THEME.hud.iconWell, 0.9);
      well.setStrokeStyle(1, UI_THEME.hud.border, 0.28);
      well.setDepth(91);
      return well;
    });

    const statusIcons = [
      ["icon_star_energy", iconX, hudRows[0], UI_VISUAL_SCALE.hudIcon * 0.82],
      ["icon_wave", iconX, hudRows[1], UI_VISUAL_SCALE.hudIcon * 0.82],
      ["icon_planet_hp", hpIconX, hudRows[1], UI_VISUAL_SCALE.hudIcon * 0.58],
      ["icon_wave", iconX, hudRows[2], UI_VISUAL_SCALE.hudIcon * 0.7]
    ];
    for (const [texture, x, y, scale] of statusIcons) {
      if (!this.hasTexture(texture)) continue;
      const icon = this.add.image(x, y, texture).setScale(scale);
      icon.setDepth(91);
    }

    this.energyLabel = this.makeHudText(hudX + 40, hudRows[0], "星能", {
      fontSize: UI_THEME.type.hudLabel,
      color: UI_THEME.hud.label,
      fontStyle: "bold"
    });
    this.energyLabel.setOrigin(0, 0.5);
    this.energyLabel.setDepth(91);

    this.waveLabel = this.makeHudText(hudX + 40, hudRows[1], "波次", {
      fontSize: UI_THEME.type.hudLabel,
      color: UI_THEME.hud.label,
      fontStyle: "bold"
    });
    this.waveLabel.setOrigin(0, 0.5);
    this.waveLabel.setDepth(91);

    this.frontlineLabel = this.makeHudText(hudX + 40, hudRows[2], "下一波", {
      fontSize: UI_THEME.type.hudLabel,
      color: UI_THEME.hud.label,
      fontStyle: "bold"
    });
    this.frontlineLabel.setOrigin(0, 0.5);
    this.frontlineLabel.setDepth(91);

    this.energyText = this.makeHudText(hudX + 226, hudRows[0], "", {
      fontSize: UI_THEME.type.hudValue,
      color: UI_THEME.hud.energy,
      fontStyle: "bold"
    });
    this.energyText.setOrigin(1, 0.5);
    this.energyText.setDepth(91);

    this.hpText = this.makeHudText(hudX + 282, hudRows[1], "", {
      fontSize: UI_THEME.type.hudMeta,
      color: UI_THEME.hud.healthy,
      fontStyle: "bold"
    });
    this.hpText.setOrigin(1, 0.5);
    this.hpText.setDepth(91);

    this.waveText = this.makeHudText(hudX + 136, hudRows[1], "", {
      fontSize: UI_THEME.type.hudValue,
      color: UI_THEME.hud.value,
      fontStyle: "bold"
    });
    this.waveText.setOrigin(1, 0.5);
    this.waveText.setDepth(91);

    const rightHudX = this.W - UI_LAYOUT.rightHud.rightInset;
    this.rightHudBg = this.add.rectangle(
      rightHudX,
      56,
      UI_LAYOUT.rightHud.width,
      UI_LAYOUT.rightHud.height,
      UI_THEME.hud.backdropFill,
      0.76
    );
    this.rightHudBg.setStrokeStyle(1, UI_THEME.hud.border, 0.44);
    this.rightHudBg.setDepth(90);
    this.rightHudAccent = this.add.rectangle(rightHudX, 5, UI_LAYOUT.rightHud.width - 14, 2, 0xa855f7, 0.42);
    this.rightHudAccent.setDepth(91);
    this.rightHudDivider = this.add.rectangle(rightHudX, 34, UI_LAYOUT.rightHud.width - 16, 1, UI_THEME.hud.separator, 0.72);
    this.rightHudDivider.setDepth(91);

    this.versionText = this.makeHudText(rightHudX, 17, GAME_VERSION, {
      fontSize: "12px",
      color: UI_THEME.hud.muted
    });
    this.versionText.setOrigin(0.5, 0.5);
    this.versionText.setAlpha(0.78);
    this.versionText.setDepth(91);

    this.frontlineText = this.makeHudText(hudX + 282, hudRows[2], "", {
      fontSize: "14px",
      color: "#dcecff",
      fontStyle: "bold"
    });
    this.frontlineText.setOrigin(1, 0.5);
    this.frontlineText.setDepth(91);

    this.createEnergyCapUpgradeButton();
    this.createSettingsButton();

    this.messageText = this.makeText(0, -1, "", {
      fontSize: UI_THEME.type.message,
      color: UI_THEME.message.info,
      fontStyle: "bold",
      align: "center",
      wordWrap: { width: 620, useAdvancedWrap: true },
      shadow: {
        offsetX: 0,
        offsetY: 2,
        color: "#020617",
        blur: 6,
        fill: true
      }
    });
    this.messageText.setOrigin(0.5, 0.5);
    this.messageText.setAlpha(UI_THEME.message.alpha);

    this.messageContainer = this.add.container(this.W / 2, this.H * UI_LAYOUT.messageYRatio, [this.messageText]);
    this.messageContainer.setDepth(94);
    this.messageContainer.setVisible(false);
    this.messageContainer.setActive(false);

    this.createDemolishButton();
    this.updateUI();
    this.showMessage("选择卡牌");
  }

  createEnergyCapUpgradeButton() {
    const x = UI_LAYOUT.hud.x + UI_LAYOUT.hud.width - 27;
    const y = UI_LAYOUT.hud.rows[0];
    const bg = this.add.rectangle(x, y, 52, 28, UI_THEME.panel.buttonFill, 0.98);
    bg.setStrokeStyle(1, UI_THEME.panel.buttonBorder, 0.9);
    bg.setInteractive({ useHandCursor: true });
    bg.setDepth(92);

    if (this.hasTexture("icon_energy_upgrade")) {
      const icon = this.add.image(x - 13, y, "icon_energy_upgrade");
      icon.setScale(UI_VISUAL_SCALE.energyUpgradeIcon * 0.82);
      icon.setDepth(93);
      this.energyCapUpgradeIcon = icon;
    }

    const label = this.makeHudText(x + 11, y - 1, "", {
      fontSize: "11px",
      color: UI_THEME.panel.value,
      fontStyle: "bold"
    });
    label.setOrigin(0.5, 0.5);
    label.setDepth(93);

    this.energyCapUpgradeButton = { bg, label, icon: this.energyCapUpgradeIcon };

    bg.on("pointerover", () => {
      if (this.maxStarEnergy < ENERGY_CAP_MAX) {
        bg.setFillStyle(UI_THEME.panel.buttonHoverFill, 1);
        bg.setStrokeStyle(2, UI_THEME.card.hoverBorder, 1);
      }
    });

    bg.on("pointerout", () => {
      this.updateEnergyCapUpgradeButtonState(true);
    });

    bg.on("pointerdown", () => {
      this.beginFixedUiInteraction();
      this.buyEnergyCapUpgrade();
    });

    this.updateEnergyCapUpgradeButtonState();
  }

  createSettingsButton() {
    const x = this.W - UI_LAYOUT.rightHud.rightInset;
    const y = 69;
    const bg = this.add.rectangle(x, y, 54, 58, UI_THEME.hud.panelAlternateFill, 0.96);
    bg.setStrokeStyle(1, UI_THEME.hud.border, 0.54);
    bg.setDepth(91);
    bg.setInteractive({ useHandCursor: true });

    const icon = this.makeText(x, y - 9, "⚙", {
      fontSize: "24px",
      color: "#dcecff",
      fontStyle: "bold"
    });
    icon.setOrigin(0.5, 0.5);
    icon.setDepth(92);

    const label = this.makeHudText(x, y + 18, "设置", {
      fontSize: "11px",
      color: UI_THEME.hud.label,
      fontStyle: "bold"
    });
    label.setOrigin(0.5, 0.5);
    label.setDepth(92);

    bg.on("pointerover", () => {
      bg.setFillStyle(UI_THEME.card.hoverFill, 0.96);
      bg.setStrokeStyle(2, UI_THEME.card.hoverBorder, 0.96);
      icon.setColor("#ffffff");
      label.setColor("#ffffff");
    });
    bg.on("pointerout", () => {
      bg.setFillStyle(UI_THEME.hud.panelAlternateFill, 0.96);
      bg.setStrokeStyle(1, UI_THEME.hud.border, 0.54);
      icon.setColor("#dcecff");
      label.setColor(UI_THEME.hud.label);
    });

    // 设置暂不引入新玩法；此处只拦截固定 UI 点击，避免误触战场。
    bg.on("pointerdown", () => this.beginFixedUiInteraction());
    this.settingsButton = { bg, icon, label };
  }

  buyEnergyCapUpgrade() {
    if (this.gameState !== "playing") {
      this.showMessage("本局已结束", "warning");
      return false;
    }

    if (this.maxStarEnergy >= ENERGY_CAP_MAX) {
      this.showMessage("星能已满", "warning");
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
    this.showMessage(`星能上限 +${ENERGY_CAP_UPGRADE_AMOUNT}`, "reward");
    return true;
  }

  updateEnergyCapUpgradeButtonState(force = false) {
    if (!this.energyCapUpgradeButton) return;

    const { bg, label } = this.energyCapUpgradeButton;
    const isFull = this.maxStarEnergy >= ENERGY_CAP_MAX;
    const stateKey = isFull ? "full" : "available";
    if (!force && this.energyCapUpgradeButton.stateKey === stateKey) return;
    this.energyCapUpgradeButton.stateKey = stateKey;

    if (isFull) {
      bg.setFillStyle(0x111827, 0.72);
      bg.setStrokeStyle(1, 0x475569, 0.65);
      this.setTextIfChanged(label, "已满");
      label.setColor("#94a3b8");
      this.energyCapUpgradeButton.icon?.setVisible(false);
      return;
    }

    bg.setFillStyle(UI_THEME.panel.buttonFill, 0.96);
    bg.setStrokeStyle(1, UI_THEME.panel.buttonBorder, 0.9);
    this.setTextIfChanged(label, `+${ENERGY_CAP_UPGRADE_AMOUNT}`);
    label.setColor(UI_THEME.panel.value);
    this.energyCapUpgradeButton.icon?.setVisible(true);
  }

  createDemolishButton() {
    const x = 1034;
    const y = this.H - 58;
    const shadow = this.add.rectangle(
      x + 4,
      y + 5,
      UI_LAYOUT.card.width,
      UI_LAYOUT.card.height,
      0x000000,
      0.46
    );
    shadow.setDepth(89);
    const bg = this.add.rectangle(x, y, UI_LAYOUT.card.width, UI_LAYOUT.card.height, UI_THEME.card.fill, 0.98);
    bg.setStrokeStyle(1, UI_THEME.card.border, 0.9);
    bg.setInteractive({ useHandCursor: true });
    bg.setDepth(90);

    const headerBand = this.add.rectangle(x, y - 37, 138, UI_LAYOUT.card.headerHeight, 0x281125, 0.94);
    headerBand.setDepth(91);
    const imagePanel = this.add.rectangle(x, y + 1, 138, UI_LAYOUT.card.imageHeight, 0x160d1d, 0.96);
    imagePanel.setDepth(91);
    const footerBand = this.add.rectangle(x, y + 39, 138, UI_LAYOUT.card.footerHeight, UI_THEME.card.footerFill, 0.98);
    footerBand.setDepth(91);
    const imageGlow = this.add.circle(x, y + 2, 25, 0xfb7185, 0.1);
    imageGlow.setDepth(91);
    const accent = this.add.rectangle(x, y - 48, 138, 3, 0xfb7185, 0.72);
    accent.setDepth(93);

    let icon = null;
    if (this.hasTexture("icon_demolish")) {
      icon = this.add.image(x, y + 1, "icon_demolish");
      icon.setScale(UI_VISUAL_SCALE.demolishIcon);
      icon.setDepth(92);
    }

    const label = this.makeHudText(x, y - 37, "拆除", {
      fontSize: UI_THEME.type.cardTitle,
      color: UI_THEME.card.title,
      fontStyle: "bold",
      shadow: {
        offsetX: 0,
        offsetY: 1,
        color: "#020617",
        blur: 3,
        fill: true
      }
    });
    label.setOrigin(0.5, 0.5);
    label.setDepth(92);

    const kind = this.makeHudText(x, y + 39, "功能", {
      fontSize: UI_THEME.type.cardMeta,
      color: UI_THEME.card.meta
    });
    kind.setOrigin(0.5, 0.5);
    kind.setDepth(92);

    this.demolishButton = { bg, label, icon, kind, accent, headerBand, imagePanel, footerBand, imageGlow };

    bg.on("pointerover", () => {
      if (!this.demolishMode) {
        bg.setFillStyle(UI_THEME.card.hoverFill, 0.98);
        bg.setStrokeStyle(2, 0xfb7185, 1);
        headerBand.setFillStyle(0xfb7185, 0.16);
        imagePanel.setFillStyle(0x2b1227, 0.98);
        imageGlow.setFillStyle(0xfb7185, 0.18);
        accent.setFillStyle(0xfb7185, 0.9);
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

  updateStarEnergy(dt) {
    if (this.gameState !== "playing") return;

    if (this.starEnergy >= this.maxStarEnergy) {
      this.energyRegenTimer = 0;
      return;
    }

    this.energyRegenTimer += dt;
    while (this.energyRegenTimer >= this.energyRegenInterval && this.starEnergy < this.maxStarEnergy) {
      this.energyRegenTimer -= this.energyRegenInterval;
      this.addStarEnergy(this.energyRegen);
    }
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
        cell.rect.setFillStyle(isLogistics ? 0x073047 : 0x0b1220, isLogistics ? 0.1 : 0.08);
        cell.inner.setStrokeStyle(1, isLogistics ? 0x67e8f9 : 0x94a3b8, isLogistics ? 0.22 : 0.12);

        if (cell.tile) {
          cell.tile.setAlpha(isLogistics ? 0.9 : 0.94);

          if (isLogistics) {
            cell.tile.setTint(GRID_VISUALS.resource.tint);
          } else {
            cell.tile.clearTint();
          }
        }

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
    if (this.gameState !== "playing") return;

    for (const building of this.buildings) {
      if (
        building.id !== "collector" ||
        building.destroyed
      ) continue;

      building.collectTimer += dt;

      const remain = Math.max(0, building.collectInterval - building.collectTimer);

      if (building.timerText) {
        building.timerText.setText(this.getCollectorTimerText(building, remain));
      }

      if (building.collectTimer >= building.collectInterval) {
        building.collectTimer = 0;

        this.addStarEnergy(building.collectAmount);
        if (building.wing === this.activeWing) {
          this.floatText(
            building.cell.x,
            building.cell.y - 42,
            `+${building.collectAmount}`,
            building.collectTextColor
          );

          this.pulseBuildingVisual(building, 1.18, 130);
        }
      }
    }
  }

  getBuildingStats(type, level) {
    const normalizedLevel = Math.max(1, Math.floor(level));
    const config = this.buildingProgressionConfig[type];
    if (!config) return null;

    if (type === "collector") {
      return {
        amount: config.amount,
        interval: Math.max(
          config.intervalFloor,
          config.intervalFloor + (config.intervalBase - config.intervalFloor) * Math.pow(config.intervalDecay, normalizedLevel - 1)
        ),
        color: config.color,
        textColor: config.textColor
      };
    }

    if (type === "turret" || type === "laser") {
      const base = config.baseStats[Math.min(normalizedLevel, 3)];
      if (normalizedLevel <= 3) return { ...base };

      const levelOffset = normalizedLevel - 3;
      return {
        damage: type === "turret" ? 8 + levelOffset * 2 : 17 + levelOffset * 4,
        cooldown: Math.max(
          config.cooldownFloor,
          type === "turret" ? 0.72 - levelOffset * 0.01 : 1.15 - levelOffset * 0.015
        ),
        range: base.range,
        color: base.color,
        textColor: base.textColor
      };
    }

    const base = config.baseStats[Math.min(normalizedLevel, 3)];
    return normalizedLevel <= 3
      ? { ...base }
      : { ...base, maxHp: 50 + (normalizedLevel - 3) * 20 };
  }

  getBuildingUpgradeCost(type, currentLevel) {
    const level = Math.max(1, Math.floor(currentLevel));

    if (type === "collector") {
      const config = this.buildingProgressionConfig.collector;
      return Math.min(config.costCap, config.costBase + (level - 1) * config.costStep);
    }

    if (type === "turret") {
      if (level === 1) return 4;
      if (level === 2) return 6;
      return Math.min(this.buildingProgressionConfig.turret.costCap, 10 + (level - 3) * 4);
    }

    if (type === "laser") {
      if (level === 1) return 7;
      if (level === 2) return 10;
      return Math.min(this.buildingProgressionConfig.laser.costCap, 14 + (level - 3) * 5);
    }

    if (type === "shield") {
      if (level === 1) return 5;
      if (level === 2) return 7;
      return Math.min(this.buildingProgressionConfig.shield.costCap, 12 + (level - 3) * 4);
    }

    return null;
  }

  formatBuildingInterval(interval) {
    return (Math.round((interval + Number.EPSILON) * 10) / 10).toFixed(1);
  }

  getCollectorTimerText(building, remainSeconds = building.collectInterval) {
    return `Lv.${building.collectLevel} 间隔 ${this.formatBuildingInterval(building.collectInterval)}s · ${Math.ceil(remainSeconds)}s`;
  }

  getCollectorUpgradeCost(level) {
    return this.getBuildingUpgradeCost("collector", level);
  }

  applyBuildingLevelStats(building, level, options = {}) {
    const stats = this.getBuildingStats(building.id || "shield", level);
    if (!stats) return null;

    if (building.id === "collector") {
      building.collectLevel = level;
      building.collectAmount = stats.amount;
      building.collectInterval = stats.interval;
      building.collectTextColor = stats.textColor;
      if (options.resetTimer) building.collectTimer = 0;

      building.glow.setFillStyle(stats.color, 0.14);
      if (!building.usesTexture) {
        building.body.setFillStyle(stats.color, 0.95);
        building.body.setStrokeStyle(3, 0x020617, 1);
        building.core.setFillStyle(0xffffff, 0.7);
      }
      building.text.setText(`采集 Lv.${level}`);
      if (building.timerText) {
        building.timerText.setColor(stats.textColor);
        building.timerText.setText(this.getCollectorTimerText(building));
      }
      return stats;
    }

    if (building.id === "turret" || building.id === "laser") {
      building.defenseLevel = level;
      building.attackDamage = stats.damage;
      building.attackCooldown = stats.cooldown;
      building.attackRange = stats.range;
      if (options.resetAttackTimer) building.attackTimer = stats.cooldown;

      building.glow.setFillStyle(stats.color, 0.14);
      this.applyWingFacing(building.body, building.frontlineId, "building");
      if (!building.usesTexture) {
        building.body.setFillStyle(stats.color, 0.95);
        building.body.setStrokeStyle(3, 0x020617, 1);
        building.core.setFillStyle(0xffffff, 0.72);
      }
      building.text.setText(`${this.getDefenseBuildingLabel(building.id)} Lv.${level}`);
      building.text.setColor(stats.textColor);
      return stats;
    }

    const previousMaxHp = building.maxHp || 0;
    building.shieldLevel = level;
    building.maxHp = stats.maxHp;
    building.currentHp = options.refillHp
      ? stats.maxHp
      : Math.min(stats.maxHp, Math.max(0, building.currentHp + (stats.maxHp - previousMaxHp)));
    building.slot.line.setFillStyle(stats.color, 0.78);
    building.slot.line.setStrokeStyle(2, 0xdbeafe, 0.95);
    if (!building.usesTexture) {
      building.shieldCore.setFillStyle(stats.color, 0.38);
      building.shieldCore.setStrokeStyle(2, 0xdbeafe, 0.85);
    }
    building.text.setText(`护盾 Lv.${level}`);
    building.text.setColor(stats.textColor);
    this.updateShieldHealthBar(building);
    return stats;
  }

  applyCollectorLevel(building, level, resetTimer = true) {
    return this.applyBuildingLevelStats(building, level, { resetTimer });
  }

  canUpgradeCollector(building, showMsg = true) {
    if (!building || building.destroyed || building.id !== "collector") {
      if (showMsg) this.showMessage("无法升级", "warning");
      return false;
    }

    const cost = this.getCollectorUpgradeCost(building.collectLevel);

    if (cost === null) {
      if (showMsg) this.showMessage("无法升级", "warning");
      return false;
    }

    if (this.starEnergy < cost) {
      if (showMsg) this.showMessage("星能不足", "warning");
      return false;
    }

    return true;
  }

  tryUpgradeCollector(cell) {
    const building = cell.building;

    if (!this.canUpgradeCollector(building, true)) return;

    const nextLevel = building.collectLevel + 1;
    const cost = this.getCollectorUpgradeCost(building.collectLevel);
    const nextStats = this.getBuildingStats("collector", nextLevel);

    this.starEnergy -= cost;
    this.applyCollectorLevel(building, nextLevel, true);

    this.floatText(cell.x, cell.y - 18, `Lv.${nextLevel}`, nextStats.textColor);
    this.showMessage(`星尘采集器 Lv${nextLevel}`, "reward");
    this.updateUI();
  }

  isDefenseBuildingId(id) {
    return id === "turret" || id === "laser";
  }

  getDefenseUpgradeCost(building) {
    return this.getBuildingUpgradeCost(building.id, building.defenseLevel);
  }

  getDefenseBuildingLabel(id) {
    if (id === "turret") return "炮台";
    if (id === "laser") return "光棱";
    return "防御";
  }

  applyDefenseBuildingLevel(building, level, resetAttackTimer = true) {
    return this.applyBuildingLevelStats(building, level, { resetAttackTimer });
  }

  canUpgradeDefenseBuilding(building, card, showMsg = true) {
    if (!building || building.destroyed || !this.isDefenseBuildingId(building.id) || building.id !== card.id) {
      if (showMsg) this.showMessage("类型不符", "warning");
      return false;
    }

    const cost = this.getDefenseUpgradeCost(building);

    if (cost === null) {
      if (showMsg) this.showMessage("无法升级", "warning");
      return false;
    }

    if (this.starEnergy < cost) {
      if (showMsg) this.showMessage("星能不足", "warning");
      return false;
    }

    return true;
  }

  tryUpgradeDefenseBuilding(cell) {
    const building = cell.building;

    if (!this.canUpgradeDefenseBuilding(building, this.selectedCard, true)) return;

    const nextLevel = building.defenseLevel + 1;
    const cost = this.getDefenseUpgradeCost(building);
    const nextStats = this.getBuildingStats(building.id, nextLevel);

    this.starEnergy -= cost;
    this.applyDefenseBuildingLevel(building, nextLevel, true);

    this.floatText(cell.x, cell.y - 18, `Lv.${nextLevel}`, nextStats.textColor);
    const buildingName = building.id === "turret" ? "星轨炮台" : "光棱卫星";
    this.showMessage(`${buildingName} Lv${nextLevel}`, "reward");
    this.updateUI();
  }

  getShieldUpgradeCost(level) {
    return this.getBuildingUpgradeCost("shield", level);
  }

  updateShieldHealthBar(shield) {
    if (!shield || shield.destroyed) return;

    const ratio = Phaser.Math.Clamp(shield.currentHp / shield.maxHp, 0, 1);
    const color = ratio > 0.5 ? this.getBuildingStats("shield", shield.shieldLevel).color : ratio > 0.25 ? 0xfacc15 : 0xfb7185;

    shield.healthBarFill.setScale(ratio, 1);
    shield.healthBarFill.setFillStyle(color, 0.95);
  }

  applyShieldLevel(shield, level, refillHp = true) {
    return this.applyBuildingLevelStats(shield, level, { refillHp });
  }

  canUpgradeShield(shield, showMsg = true) {
    if (!shield || shield.destroyed) {
      if (showMsg) this.showMessage("无法升级", "warning");
      return false;
    }

    const cost = this.getShieldUpgradeCost(shield.shieldLevel);

    if (cost === null) {
      if (showMsg) this.showMessage("无法升级", "warning");
      return false;
    }

    if (this.starEnergy < cost) {
      if (showMsg) this.showMessage("星能不足", "warning");
      return false;
    }

    return true;
  }

  tryUpgradeShield(slot) {
    const shield = slot.shield;

    if (!this.canUpgradeShield(shield, true)) return;

    const nextLevel = shield.shieldLevel + 1;
    const cost = this.getShieldUpgradeCost(shield.shieldLevel);
    const nextStats = this.getBuildingStats("shield", nextLevel);

    this.starEnergy -= cost;
    this.applyShieldLevel(shield, nextLevel, false);

    this.floatText(slot.x, slot.y - 18, `Lv.${nextLevel}`, nextStats.textColor);
    this.showMessage(`引力护盾 Lv${nextLevel}`, "reward");
    this.updateUI();
  }

  addStarEnergy(amount) {
    const previousEnergy = this.starEnergy;
    this.starEnergy = Math.min(this.maxStarEnergy, this.starEnergy + Math.floor(amount));
    if (this.starEnergy !== previousEnergy) this.updateUI();
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
    if (this.gameState !== "playing") {
      this.meteorPreviewOuter?.setVisible(false);
      this.meteorPreviewInner?.setVisible(false);
      return;
    }

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

  updateMeteorCardUI(force = false) {
    const card = this.meteorCard || this.cards?.find((item) => item.data.id === "meteor");
    if (!card) return;

    const upgradeCost = this.getMeteorUpgradeCost();
    const canUpgrade = this.gameState === "playing" && this.starEnergy >= upgradeCost;
    const stateKey = `${this.meteorLevel}|${upgradeCost}|${canUpgrade}`;
    if (!force && card.meteorUiState === stateKey) return;
    card.meteorUiState = stateKey;
    this.setTextIfChanged(card.levelBadge, `Lv${this.meteorLevel}`);
    this.setTextIfChanged(card.upgradeText, `升级 ${upgradeCost}`);
    card.upgradeButton?.setFillStyle(canUpgrade ? 0x7c2d12 : 0x2b1410, canUpgrade ? 0.96 : 0.88);
    card.upgradeButton?.setStrokeStyle(1, canUpgrade ? UI_THEME.card.meteorBorder : 0x6b3a2d, canUpgrade ? 0.9 : 0.5);
    card.upgradeText?.setColor(canUpgrade ? "#ffedd5" : "#9f7668");
    card.upgradeText?.setAlpha(canUpgrade ? 1 : 0.72);
  }

  applyCardVisualState(card, state = "normal", force = false) {
    if (!card) return;
    if (!force && card.visualState === state) return;
    card.visualState = state;

    const accentColor = card.accentColor || 0x38bdf8;
    const isMeteorCard = card.data?.id === "meteor";
    const setContent = (titleAlpha, costAlpha, iconAlpha, thumbnailAlpha) => {
      card.title?.setAlpha(titleAlpha);
      card.cost?.setAlpha(costAlpha);
      card.costIcon?.setAlpha(iconAlpha);
      card.thumbnail?.setAlpha(thumbnailAlpha);
      card.levelBadge?.setAlpha(titleAlpha);
    };

    if (state === "selected") {
      card.bg.setFillStyle(isMeteorCard ? UI_THEME.card.meteorSelectedFill : UI_THEME.card.selectedFill, 1);
      card.bg.setStrokeStyle(2, isMeteorCard ? UI_THEME.card.meteorBorder : UI_THEME.card.selectedBorder, 1);
      card.headerBand?.setFillStyle(accentColor, 0.22);
      card.imagePanel?.setFillStyle(isMeteorCard ? UI_THEME.card.meteorSelectedImageFill : UI_THEME.card.selectedImageFill, 0.98);
      card.footerBand?.setFillStyle(isMeteorCard ? 0x241006 : 0x071a2b, 0.98);
      card.accent?.setFillStyle(accentColor, 1);
      card.imageGlow?.setFillStyle(isMeteorCard ? UI_THEME.card.meteorGlow : accentColor, isMeteorCard ? 0.32 : 0.22);
      card.title?.setColor(UI_THEME.card.title);
      card.cost?.setColor(UI_THEME.card.cost);
      setContent(1, 1, 1, 1);
      return;
    }

    if (state === "hover") {
      card.bg.setFillStyle(isMeteorCard ? UI_THEME.card.meteorFill : UI_THEME.card.hoverFill, 0.98);
      card.bg.setStrokeStyle(2, isMeteorCard ? UI_THEME.card.meteorBorder : UI_THEME.card.hoverBorder, 1);
      card.headerBand?.setFillStyle(accentColor, 0.16);
      card.imagePanel?.setFillStyle(isMeteorCard ? UI_THEME.card.meteorImageFill : UI_THEME.card.hoverImageFill, 0.98);
      card.footerBand?.setFillStyle(isMeteorCard ? 0x1d0d05 : 0x061523, 0.98);
      card.accent?.setFillStyle(accentColor, 0.88);
      card.imageGlow?.setFillStyle(accentColor, 0.17);
      card.title?.setColor(UI_THEME.card.title);
      card.cost?.setColor(UI_THEME.card.cost);
      setContent(1, 1, 1, 1);
      return;
    }

    if (state === "unavailable") {
      card.bg.setFillStyle(UI_THEME.card.unavailableFill, 0.92);
      card.bg.setStrokeStyle(1, UI_THEME.card.border, 0.42);
      card.headerBand?.setFillStyle(UI_THEME.card.unavailableFill, 0.98);
      card.imagePanel?.setFillStyle(UI_THEME.card.unavailableImageFill, 0.94);
      card.footerBand?.setFillStyle(0x050912, 0.98);
      card.accent?.setFillStyle(accentColor, 0.12);
      card.imageGlow?.setFillStyle(accentColor, 0.02);
      card.title?.setColor(UI_THEME.card.meta);
      card.cost?.setColor(UI_THEME.card.unavailableCost);
      setContent(0.46, 0.72, 0.46, 0.32);
      return;
    }

    card.bg.setFillStyle(isMeteorCard ? UI_THEME.card.meteorFill : UI_THEME.card.fill, 0.98);
    card.bg.setStrokeStyle(1, isMeteorCard ? UI_THEME.card.meteorBorder : UI_THEME.card.border, isMeteorCard ? 0.72 : 0.9);
    card.headerBand?.setFillStyle(isMeteorCard ? 0x321407 : UI_THEME.card.headerFill, 0.96);
    card.imagePanel?.setFillStyle(isMeteorCard ? UI_THEME.card.meteorImageFill : UI_THEME.card.imageFill, 0.96);
    card.footerBand?.setFillStyle(isMeteorCard ? 0x180b05 : UI_THEME.card.footerFill, 0.98);
    card.accent?.setFillStyle(accentColor, 0.72);
    card.imageGlow?.setFillStyle(isMeteorCard ? UI_THEME.card.meteorGlow : accentColor, isMeteorCard ? 0.16 : 0.1);
    card.title?.setColor(UI_THEME.card.title);
    card.cost?.setColor(UI_THEME.card.cost);
    setContent(1, 1, 1, 1);
  }

  clearCardSelection() {
    this.selectedCard = null;

    for (const card of this.cards) {
      this.applyCardVisualState(card, this.starEnergy < card.data.cost ? "unavailable" : "normal");
    }
  }

  toggleDemolishMode() {
    this.setDemolishMode(!this.demolishMode);
  }

  setDemolishMode(enabled, showFeedback = true) {
    if (enabled && this.gameState !== "playing") {
      if (showFeedback) this.showMessage("本局已结束", "warning");
      return;
    }

    if (enabled && this.frontlineTransitioning) {
      if (showFeedback) this.showMessage("战区转移中", "warning");
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

    const { bg, label, headerBand, imagePanel, footerBand, imageGlow, accent, icon, kind } = this.demolishButton;

    if (this.demolishMode) {
      bg.setFillStyle(0x3f0d1d, 1);
      bg.setStrokeStyle(2, 0xfb7185, 1);
      headerBand?.setFillStyle(0xfb7185, 0.24);
      imagePanel?.setFillStyle(0x351126, 1);
      footerBand?.setFillStyle(0x260b18, 1);
      imageGlow?.setFillStyle(0xfb7185, 0.24);
      label.setText("拆除中");
      label.setColor("#fecdd3");
      kind?.setText("点击目标");
      kind?.setColor("#fecdd3");
      icon?.setAlpha(1);
      accent?.setFillStyle(0xfb7185, 1);
      return;
    }

    bg.setFillStyle(UI_THEME.card.fill, 0.98);
    bg.setStrokeStyle(1, UI_THEME.card.border, 0.9);
    headerBand?.setFillStyle(0x281125, 0.94);
    imagePanel?.setFillStyle(0x160d1d, 0.96);
    footerBand?.setFillStyle(UI_THEME.card.footerFill, 0.98);
    imageGlow?.setFillStyle(0xfb7185, 0.1);
    label.setText("拆除");
    label.setColor(UI_THEME.card.title);
    kind?.setText("功能");
    kind?.setColor(UI_THEME.card.meta);
    icon?.setAlpha(1);
    accent?.setFillStyle(0xfb7185, 0.72);
  }

  beginCardDragCandidate(card, pointer) {
    if (this.gameState !== "playing") return;

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
    if (this.isDirectionalBuildingVisual(card.id)) {
      this.applyWingFacing(ghost, this.frontlineIndex, "building");
    }
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
    if (this.gameState !== "playing") return;

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
    if (this.gameState !== "playing") {
      this.cancelCardDrag();
      return false;
    }

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
      this.showMessage("无法部署", "warning");
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
    if (this.gameState !== "playing") return;

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
    if (this.gameState !== "playing") return;

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
      this.gameState !== "playing" ||
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
    if (this.gameState !== "playing" || !this.demolishMode || this.pointerDragging || this.frontlineTransitioning) return;

    if (!target || target.destroyed || target.frontlineId !== this.frontlineIndex) {
      this.pendingDemolishTarget = null;
      return;
    }

    this.pendingDemolishTarget = target;
  }

  finishPointerInteraction(pointer) {
    if (this.gameState !== "playing") {
      this.cancelPendingMapAction();
      this.cancelCardDrag();
      this.pointerPressStart = null;
      this.pointerDragging = false;
      this.fixedUiPointerActive = false;
      this.pointerIsTouch = false;
      return;
    }

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
      this.showMessage("本局已结束", "warning");
      return;
    }

    this.setDemolishMode(false, false);
    this.selectedCard = cardData;

    for (const card of this.cards) {
      this.applyCardVisualState(card, card.data.id === cardData.id ? "selected" : "normal");
    }

    this.updateUI();
    this.showMessage(`已选：${cardData.name}`);

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
      if (showMsg) this.showMessage("格子已占用", "warning");
      return false;
    }

    if (card.id === "collector" && cell.type !== "logistics") {
      if (showMsg) this.showMessage("区域不适用", "warning");
      return false;
    }

    if ((card.id === "turret" || card.id === "laser") && cell.type === "logistics") {
      if (showMsg) this.showMessage("区域不适用", "warning");
      return false;
    }

    return true;
  }

  tryPlaceOnCell(cell) {
    if (this.gameState !== "playing") return;

    if (this.frontlineTransitioning) {
      this.showMessage("战区转移中", "warning");
      return;
    }

    if (!this.selectedCard) {
      this.showMessage("请选择卡牌", "warning");
      return;
    }

    if (this.selectedCard.id === "shield") {
      this.showMessage("请放置在护盾位", "warning");
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
        this.showMessage("格子已占用", "warning");
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
    const buildingGlow = this.addToFrontline(this.add.circle(cell.x, cell.y, 28, color, 0.12));

    const visualConfig = BUILDING_VISUALS[card.id];
    const usesTexture = visualConfig && this.hasTexture(visualConfig.texture);
    const body = usesTexture
      ? this.addToFrontline(this.add.image(cell.x, cell.y, visualConfig.texture).setScale(visualConfig.scale))
      : this.addToFrontline(this.add.rectangle(cell.x, cell.y, 44, 44, color, 0.95));
    if (!usesTexture) body.setStrokeStyle(3, 0x020617, 1);
    const facingDirection = this.isDirectionalBuildingVisual(card.id)
      ? this.getWingFacingDirection(cell.frontlineId, "building")
      : 0;
    if (facingDirection) {
      this.applyWingFacing(body, cell.frontlineId, "building");
    }

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
      wing: this.activeWing,
      gridKey: this.getGridCellKey(cell),
      frontlineId: cell.frontlineId,
      region: cell.type,
      cell,
      body,
      glow: buildingGlow,
      buildingGlow,
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
      defenseLevel: 0,
      facingDirection,
      ambientTween: null,
      feedbackTween: null
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
    this.registerBuildingInWing(building);

    this.createBuildingAmbientTween(building);

    this.showMessage(`${card.name} 已部署`);
  }

  tryPlaceShield(slot) {
    if (this.gameState !== "playing") return;

    if (this.frontlineTransitioning) {
      this.showMessage("战区转移中", "warning");
      return;
    }

    if (!this.selectedCard) {
      this.showMessage("请选择护盾", "warning");
      return;
    }

    if (this.selectedCard.id !== "shield") {
      this.showMessage("请选择护盾", "warning");
      return;
    }

    if (!slot.active) {
      this.showMessage("区域不适用", "warning");
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

    const shield = {
      targetType: "shield",
      wing: this.activeWing,
      slotKey: this.getShieldSlotKey(slot),
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
      destroyed: false,
      ambientTween: null
    };

    this.applyShieldLevel(shield, 1, true);

    slot.shield = shield;
    this.shields.push(shield);
    this.registerShieldInWing(shield);
    this.createShieldAmbientTween(shield);

    this.showMessage("护盾已展开");
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

    this.showMessage(hitCount > 0 ? `陨星命中 ${hitCount}` : "陨星已释放");
    this.updateUI();
  }

  updateWaves(dt) {
    if (this.gameState !== "playing") return;
    if (this.waveCompletionPending) return;

    const wave = this.getWaveConfig(this.currentWaveIndex);

    if (!this.waveActive && this.waveSpawned === 0) {
      this.waveStartTimer -= dt;

      if (this.waveStartTimer <= 0) {
        this.startWave();
      }

      this.updateHudValues();
      return;
    }

    if (this.waveActive) {
      this.waveSpawnTimer -= dt;

      while (this.waveSpawnTimer <= 0 && this.waveSpawned < wave.count) {
        const enemyType = this.waveQueue[this.waveSpawned] || "basic";
        this.spawnEnemy(wave, enemyType);
        this.waveSpawned++;
        this.waveSpawnTimer += wave.interval;
      }

      if (this.waveSpawned >= wave.count) {
        this.waveActive = false;
      }
    }

    if (!this.waveActive && this.waveSpawned >= wave.count && this.enemies.length === 0) {
      const completedWave = this.currentWaveIndex + 1;
      this.runStats.completedWaves = Math.max(this.runStats.completedWaves, completedWave);

      this.currentWaveIndex++;
      this.waveSpawned = 0;
      this.waveQueue = [];
      this.processCompletedWave(completedWave);
    }

    this.updateHudValues();
  }

  startWave() {
    if (this.gameState !== "playing") return;

    this.waveActive = true;
    this.waveSpawnTimer = 0;
    const wave = this.getWaveConfig(this.currentWaveIndex);
    this.waveQueue = this.buildWaveQueue(this.currentWaveIndex, wave.count);
    this.runStats.highestWaveReached = Math.max(
      this.runStats.highestWaveReached,
      this.currentWaveIndex + 1
    );

    this.showMessage(`第 ${this.currentWaveIndex + 1} 波来袭`);
    this.updateUI();
  }

  getWaveConfig(waveIndex) {
    const template = this.waveTemplates[waveIndex % this.waveTemplates.length];
    const waveNumber = waveIndex + 1;
    const decade = Math.floor(waveIndex / this.waveTemplates.length);
    const hpBonus = waveIndex * 4 + decade * 22;

    return {
      count: this.getWaveEnemyCount(waveNumber),
      interval: this.getWaveSpawnInterval(waveNumber, template.interval),
      hp: template.hp + hpBonus,
      speed: template.speed + Math.min(decade * 3, 15),
      damage: template.damage + decade + Math.floor(waveIndex / 15),
      reward: template.reward
    };
  }

  getWaveEnemyCount(waveNumber) {
    const template = this.waveTemplates[(waveNumber - 1) % this.waveTemplates.length];
    const decadeIndex = Math.floor((waveNumber - 1) / this.waveTemplates.length);
    const configuredBonus = this.wavePressureConfig.countBonusesByDecade[decadeIndex];
    const overflowDecades = Math.max(0, decadeIndex - (this.wavePressureConfig.countBonusesByDecade.length - 1));
    const lastConfiguredBonus = this.wavePressureConfig.countBonusesByDecade[
      this.wavePressureConfig.countBonusesByDecade.length - 1
    ];
    const bonus = configuredBonus ?? (
      lastConfiguredBonus +
      overflowDecades * this.wavePressureConfig.extraCountBonusPerDecade
    );

    return template.count + bonus;
  }

  getWaveSpawnInterval(waveNumber, baseInterval) {
    const decadeIndex = Math.floor((waveNumber - 1) / this.waveTemplates.length);
    const multiplierIndex = Math.min(
      decadeIndex,
      this.wavePressureConfig.spawnIntervalMultipliers.length - 1
    );
    const multiplier = this.wavePressureConfig.spawnIntervalMultipliers[multiplierIndex];

    return Math.max(
      this.wavePressureConfig.minimumSpawnInterval,
      baseInterval * multiplier
    );
  }

  getWaveComposition(waveNumber) {
    return this.enemySpawnConfig.waveCompositions.find(
      (composition) => waveNumber <= composition.maxWave
    );
  }

  buildWaveQueue(waveIndex, totalCount) {
    const waveNumber = waveIndex + 1;
    const composition = this.getWaveComposition(waveNumber);
    const enemyTypes = ["basic", "fast", "tank", "ranged", "breaker", "leaper"];
    const counts = {
      basic: totalCount,
      fast: 0,
      tank: 0,
      ranged: 0,
      breaker: 0,
      leaper: 0
    };

    for (const type of enemyTypes.slice(1)) {
      counts[type] = Math.round(totalCount * (composition[type] || 0));
      counts.basic -= counts[type];
    }

    while (counts.basic < 0) {
      const donor = enemyTypes.slice(1)
        .filter((type) => counts[type] > 0)
        .sort((left, right) => counts[right] - counts[left])[0];

      if (!donor) break;

      counts[donor]--;
      counts.basic++;
    }

    const minimums = { basic: 0, fast: 0, tank: 0, ranged: 0, breaker: 0, leaper: 0 };

    if (waveNumber >= 9 && totalCount > 0) {
      minimums.tank = 1;
    }

    if (waveNumber >= 11 && waveNumber < 21 && totalCount >= 3) {
      minimums.basic = 1;
      minimums.fast = 1;
      minimums.tank = 1;
    }

    for (const type of ["ranged", "breaker", "leaper"]) {
      const config = this.enemySpawnConfig[type];

      if (config && waveNumber >= config.minWave && waveNumber < 21) {
        const requiredCount = 3 + ["ranged", "breaker", "leaper"].filter(
          (specialType) => this.enemySpawnConfig[specialType] && waveNumber >= this.enemySpawnConfig[specialType].minWave
        ).length;

        if (totalCount >= requiredCount) {
          minimums[type] = 1;
        }
      }
    }

    if (waveNumber >= 21) {
      minimums.basic = totalCount > 0 ? 1 : 0;
      const focusType = this.getSpecialFocusType(waveNumber);

      if (focusType && totalCount >= 2) {
        minimums[focusType] = 1;
      }
    }

    for (const type of enemyTypes) {
      while (counts[type] < minimums[type]) {
        const donor = enemyTypes
          .filter((candidate) => candidate !== type && counts[candidate] > minimums[candidate])
          .sort((left, right) => counts[right] - counts[left])[0];

        if (!donor) break;

        counts[donor]--;
        counts[type]++;
      }
    }

    const queue = [
      ...Array(counts.basic).fill("basic"),
      ...Array(counts.fast).fill("fast"),
      ...Array(counts.tank).fill("tank"),
      ...Array(counts.ranged).fill("ranged"),
      ...Array(counts.breaker).fill("breaker"),
      ...Array(counts.leaper).fill("leaper")
    ];

    for (let index = queue.length - 1; index > 0; index--) {
      const swapIndex = Phaser.Math.Between(0, index);
      [queue[index], queue[swapIndex]] = [queue[swapIndex], queue[index]];
    }

    this.repairEnemyQueueRuns(queue, "tank");
    for (const type of this.enemySpawnConfig.specialRotation || []) {
      this.repairEnemyQueueRuns(queue, type);
    }

    return queue;
  }

  getSpecialFocusType(waveNumber) {
    const specialRotation = this.enemySpawnConfig.specialRotation || [];
    return specialRotation[(waveNumber - 21) % specialRotation.length] || null;
  }

  repairEnemyQueueRuns(queue, type) {
    let repaired = true;

    while (repaired) {
      repaired = false;

      for (let index = 2; index < queue.length; index++) {
        if (queue[index - 2] !== type || queue[index - 1] !== type || queue[index] !== type) continue;

        const swapIndex = queue.findIndex(
          (candidate, candidateIndex) => candidate !== type && candidateIndex !== index - 2 && candidateIndex !== index - 1
        );

        if (swapIndex !== -1) {
          [queue[index], queue[swapIndex]] = [queue[swapIndex], queue[index]];
          repaired = true;
        }

        break;
      }
    }
  }

  getFrontlineLabel() {
    return this.enemyDirection < 0 ? "右翼战区 " : "左翼战区 ";
  }

  getFrontlineShortLabel() {
    return this.enemyDirection < 0 ? "右翼" : "左翼";
  }

  switchFrontline(completedWave) {
    if (this.gameState !== "playing" || this.frontlineTransitioning) return;

    const outgoingX = -this.enemyDirection * this.W;

    this.cancelPendingDemolish();
    this.pointerPressStart = null;
    this.pointerDragging = false;
    this.fixedUiPointerActive = false;
    this.clearCurrentFrontline();
    this.frontlineTransitioning = true;
    this.waveStartTimer = this.waveRestTime;
    this.updateMeteorPreview(this.input.activePointer);

    this.showMessage("战区转移中");
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
    if (this.gameState !== "playing") return;

    const oldPortalX = this.portalX;
    const oldPlanetX = this.planetX;

    this.enemyDirection *= -1;
    [this.portalX, this.planetX] = [this.planetX, this.portalX];
    this.moveVisuals(this.portalVisuals, this.portalX - oldPortalX, 0);
    this.moveVisuals(this.planetVisuals, this.planetX - oldPlanetX, 0);
    this.frontlineIndex++;
    this.activeWing = this.getWingName(this.frontlineIndex);
    this.updateBattlefieldOrientation();
    this.updateDirectionVisuals();
    this.updateFrontlineOwnership();
    this.restoreActiveWingState();
    this.frontlineLayer.x = -outgoingX;

    this.showMessage(`转战${this.getFrontlineShortLabel()}`);
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
    if (this.gameState !== "playing") return;

    this.frontlineLayer.x = 0;
    const finishTransition = () => {
      if (this.gameState !== "playing") return;
      this.frontlineTransitioning = false;
      this.updateUI();
    };

    if (this.activeWing === "left" && !this.firstLeftWingSupplyDelivered) {
      this.deliverFirstLeftWingSupply(finishTransition);
      return;
    }

    finishTransition();
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

  isDirectionalBuildingVisual(id) {
    return id === "turret" || id === "laser";
  }

  getWingEnemyDirection(frontlineId) {
    return frontlineId % 2 === 1 ? -1 : 1;
  }

  getWingFacingDirection(frontlineId, role = "enemy") {
    const enemyDirection = this.getWingEnemyDirection(frontlineId);
    return role === "building" ? -enemyDirection : enemyDirection;
  }

  getWingFlipX(frontlineId, role = "enemy") {
    return this.getWingFacingDirection(frontlineId, role) < 0;
  }

  applyWingFacing(sprite, frontlineId, role = "enemy") {
    if (!sprite?.setFlipX) return;

    // 朝向只由所属战区决定，停止、攻击和跃迁均不改变视觉方向。
    sprite.setFlipX(this.getWingFlipX(frontlineId, role));
  }

  applyEnemyWingFacing(enemy) {
    if (!enemy?.body) return;
    this.applyWingFacing(enemy.body, enemy.frontlineId, "enemy");
  }

  getBuildingFacingDirection(building) {
    return building.facingDirection ?? this.getWingFacingDirection(building.frontlineId, "building");
  }

  getWingName(frontlineId = this.frontlineIndex) {
    return frontlineId % 2 === 1 ? "right" : "left";
  }

  createWingStates() {
    return {
      left: { buildings: [], shields: [], cellOccupancy: new Map(), shieldOccupancy: new Map() },
      right: { buildings: [], shields: [], cellOccupancy: new Map(), shieldOccupancy: new Map() }
    };
  }

  getWingState(wing = this.activeWing) {
    return this.wingStates?.[wing] || { buildings: [], shields: [], cellOccupancy: new Map(), shieldOccupancy: new Map() };
  }

  getGridCellKey(cell) {
    return `${cell.row}:${cell.col}`;
  }

  getShieldSlotKey(slot) {
    return `${slot.row}:${slot.edge}`;
  }

  findGridCellByKey(key) {
    for (const row of this.gridCells) {
      for (const cell of row) {
        if (this.getGridCellKey(cell) === key) return cell;
      }
    }
    return null;
  }

  findShieldSlotByKey(key) {
    return this.shieldSlots.find((slot) => this.getShieldSlotKey(slot) === key) || null;
  }

  registerBuildingInWing(building) {
    const state = this.getWingState(building?.wing);
    if (!building || !state || !building.gridKey) return;

    if (!state.buildings.includes(building)) state.buildings.push(building);
    state.cellOccupancy.set(building.gridKey, building);
  }

  registerShieldInWing(shield) {
    const state = this.getWingState(shield?.wing);
    if (!shield || !state || !shield.slotKey) return;

    if (!state.shields.includes(shield)) state.shields.push(shield);
    state.shieldOccupancy.set(shield.slotKey, shield);
  }

  isBuildingRegistered(building) {
    if (!building || building.destroyed) return false;
    if (!building.wing || !building.gridKey || !this.wingStates) return building.cell?.building === building;
    return this.getWingState(building.wing).cellOccupancy.get(building.gridKey) === building;
  }

  isShieldRegistered(shield) {
    if (!shield || shield.destroyed) return false;
    if (!shield.wing || !shield.slotKey || !this.wingStates) return shield.slot?.shield === shield;
    return this.getWingState(shield.wing).shieldOccupancy.get(shield.slotKey) === shield;
  }

  setWingObjectVisible(object, visible) {
    if (!object) return;
    object.setVisible?.(visible);
    object.setActive?.(visible);
  }

  createBuildingAmbientTween(building) {
    if (!building?.buildingGlow) return null;

    this.stopManagedTween(building.ambientTween);
    building.buildingGlow.setScale?.(1);
    building.buildingGlow.setAlpha?.(0.12);
    building.ambientTween = this.tweens.add({
      targets: building.buildingGlow,
      alpha: 0.20,
      duration: 1200,
      yoyo: true,
      repeat: -1
    });
    return building.ambientTween;
  }

  pulseBuildingVisual(building, targetScale = 1.18, duration = 130) {
    const glow = building?.buildingGlow;
    if (!glow || building.destroyed || building.wing !== this.activeWing || glow.visible === false) return null;

    this.stopManagedTween(building.feedbackTween);
    glow.setScale?.(1);
    let feedbackTween = null;
    feedbackTween = this.tweens.add({
      targets: glow,
      scale: targetScale,
      duration,
      yoyo: true,
      onComplete: () => {
        glow.setScale?.(1);
        if (building.feedbackTween === feedbackTween) building.feedbackTween = null;
      }
    });
    building.feedbackTween = feedbackTween;
    return feedbackTween;
  }

  createShieldAmbientTween(shield) {
    if (!shield?.shieldCore) return null;

    this.stopManagedTween(shield.ambientTween);
    const baseAlpha = shield.usesTexture ? 1 : 0.38;
    shield.shieldCore.setAlpha?.(baseAlpha);
    shield.ambientTween = this.tweens.add({
      targets: shield.shieldCore,
      alpha: shield.usesTexture ? 0.72 : 0.28,
      duration: 900,
      yoyo: true,
      repeat: -1
    });
    return shield.ambientTween;
  }

  syncWingAnimationState() {
    for (const building of this.buildings || []) {
      const shouldPause = building.destroyed || building.wing !== this.activeWing;
      this.setManagedTweenPaused(building.ambientTween, shouldPause);
      this.setManagedTweenPaused(building.feedbackTween, shouldPause);
    }

    for (const shield of this.shields || []) {
      const shouldPause = shield.destroyed || shield.wing !== this.activeWing;
      this.setManagedTweenPaused(shield.ambientTween, shouldPause);
    }
  }

  setBuildingWingVisibility(building, visible) {
    if (!building) return;

    for (const object of [
      building.glow,
      building.body,
      building.core,
      building.text,
      building.healthBarBg,
      building.healthBarFill,
      building.timerText
    ]) {
      this.setWingObjectVisible(object, visible);
    }

    this.setManagedTweenPaused(building.ambientTween, !visible);
    this.setManagedTweenPaused(building.feedbackTween, !visible);

    if (visible && this.isDirectionalBuildingVisual(building.id)) {
      this.applyWingFacing(building.body, building.frontlineId, "building");
    }
  }

  setShieldWingVisibility(shield, visible) {
    if (!shield) return;

    for (const object of [shield.shieldCore, shield.healthBarBg, shield.healthBarFill, shield.text]) {
      this.setWingObjectVisible(object, visible);
    }
    this.setManagedTweenPaused(shield.ambientTween, !visible);
  }

  detachActiveWingState() {
    const state = this.getWingState(this.activeWing);

    for (const building of state.buildings) {
      this.setBuildingWingVisibility(building, false);
    }
    for (const shield of state.shields) {
      this.setShieldWingVisibility(shield, false);
    }

    for (const row of this.gridCells) {
      for (const cell of row) {
        cell.occupied = false;
        cell.building = null;
        this.resetCellStroke(cell);
      }
    }
    for (const slot of this.shieldSlots) {
      slot.placed = false;
      slot.shield = null;
      slot.line.setAlpha(1);
      slot.line.setFillStyle(0x60a5fa, 0.13);
      slot.line.setStrokeStyle(1, 0x93c5fd, 0.25);
    }
  }

  restoreActiveWingState() {
    const state = this.getWingState(this.activeWing);

    for (const building of state.buildings) {
      if (building.destroyed || !this.isBuildingRegistered(building)) continue;
      const cell = this.findGridCellByKey(building.gridKey);
      if (!cell) continue;

      building.cell = cell;
      building.frontlineId = this.frontlineIndex;
      building.region = cell.type;
      building.facingDirection = this.isDirectionalBuildingVisual(building.id)
        ? this.getWingFacingDirection(this.frontlineIndex, "building")
        : 0;
      cell.occupied = true;
      cell.building = building;
      this.updateBuildingHealthBar(building);
      this.setBuildingWingVisibility(building, true);
    }

    for (const shield of state.shields) {
      if (shield.destroyed || !this.isShieldRegistered(shield)) continue;
      const slot = this.findShieldSlotByKey(shield.slotKey);
      if (!slot) continue;

      shield.slot = slot;
      shield.frontlineId = this.frontlineIndex;
      slot.placed = true;
      slot.shield = shield;
      this.applyShieldLevel(shield, shield.shieldLevel, false);
      this.setShieldWingVisibility(shield, true);
    }
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
    // 双战区建筑保留在原战区，离开后不再转为后台产能。
    this.storedCollectors = [];
    return 0;
  }

  getCollectorCounts() {
    const current = this.buildings.filter((building) => (
      building.id === "collector" && !building.destroyed && building.wing === this.activeWing
    )).length;
    const stored = this.buildings.filter((building) => (
      building.id === "collector" && !building.destroyed && building.wing !== this.activeWing
    )).length;

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

    for (const enemy of [...this.enemies]) {
      this.destroyEnemy(enemy, false);
    }

    this.detachActiveWingState();
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
      target.wing !== this.activeWing ||
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
      building.wing !== this.activeWing ||
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
      this.showMessage("已拆除");
    } else {
      this.floatText(x, y - 22, "已拆除", "#fb7185");
      this.showMessage("已拆除");
    }

    return true;
  }

  demolishShield(shield) {
    if (
      !shield ||
      shield.destroyed ||
      shield.wing !== this.activeWing ||
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
      this.showMessage("已拆除");
    } else {
      this.floatText(x, y - 22, "已拆除", "#fb7185");
      this.showMessage("已拆除");
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
    if (!building || building.destroyed || building.wing !== this.activeWing) return;

    building.currentHp = Math.max(0, building.currentHp - amount);
    this.updateBuildingHealthBar(building);

    if (building.currentHp <= 0) {
      const label = building.text?.text || "建筑";
      this.destroyBuilding(building);
      this.showMessage("建筑被摧毁", "danger");
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

    const state = this.getWingState(building.wing);
    state.cellOccupancy.delete(building.gridKey);
    const stateIndex = state.buildings.indexOf(building);
    if (stateIndex !== -1) state.buildings.splice(stateIndex, 1);

    const index = this.buildings.indexOf(building);

    if (index !== -1) {
      this.buildings.splice(index, 1);
    }

    this.stopManagedTween(building.ambientTween);
    this.stopManagedTween(building.feedbackTween);
    building.ambientTween = null;
    building.feedbackTween = null;
    this.tweens.killTweensOf([building.glow, building.body, building.core].filter(Boolean));

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

  spawnEnemy(wave, type = "basic") {
    const row = Phaser.Math.Between(0, this.rows - 1);
    const x = this.portalX + this.enemyDirection * 12;
    const y = this.startY + row * this.cellH;
    const frontlineId = this.frontlineIndex;
    const facingDirection = this.getWingFacingDirection(frontlineId, "enemy");

    const typeConfig = this.enemySpawnConfig[type] || this.enemySpawnConfig.basic;
    const isFast = type === "fast";
    const isTank = type === "tank";
    const isBreaker = type === "breaker";
    const isLeaper = type === "leaper";
    const isRanged = type === "ranged";
    const aura = this.add.circle(
      0,
      0,
      isTank ? 25 : isBreaker ? 23 : isLeaper ? 19 : isRanged ? 20 : isFast ? 18 : 22,
      isTank ? 0x7f1d1d : isBreaker ? 0xc026d3 : isLeaper ? 0x8b5cf6 : isRanged ? 0xa78bfa : isFast ? 0xe879f9 : 0xfb7185,
      0.14
    );
    const enemyVisual = ENEMY_VISUALS[type] || ENEMY_VISUALS.basic;
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
      type,
      row,
      frontlineId,
      x,
      y,
      lastX: x,
      hp: Math.max(1, Math.round(wave.hp * typeConfig.hpMultiplier)),
      maxHp: Math.max(1, Math.round(wave.hp * typeConfig.hpMultiplier)),
      speed: wave.speed * typeConfig.speedMultiplier,
      damage: Math.max(1, Math.round(wave.damage * typeConfig.damageMultiplier)),
      attackCooldown: typeConfig.attackCooldown ?? this.enemyCombatConfig.attackInterval,
      attackRange: typeConfig.attackRange ?? 0,
      shieldDamageMultiplier: typeConfig.shieldDamageMultiplier ?? 1,
      attackTimer: 0,
      attackTarget: null,
      reward: typeConfig.killReward,
      killCounted: false,
      direction: facingDirection,
      hasLeaped: false,
      leapAttempted: false,
      isLeaping: false,
      radius: 18,
      body,
      container,
      hpFill,
      dead: false
    };

    this.applyEnemyWingFacing(enemy);
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
    if (this.gameState !== "playing") return;

    for (const enemy of this.enemies) {
      if (enemy.dead || !enemy.attackTarget) continue;

      if (!this.isEnemyAttackTargetValid(enemy, enemy.attackTarget)) {
        this.clearEnemyTarget(enemy);
        continue;
      }

      enemy.attackTimer += dt;

      while (enemy.attackTarget && enemy.attackTimer >= enemy.attackCooldown) {
        const target = enemy.attackTarget;

        enemy.attackTimer -= enemy.attackCooldown;

        if (!this.isEnemyAttackTargetValid(enemy, target)) {
          this.clearEnemyTarget(enemy);
          break;
        }

        const attackDamage = this.getEnemyAttackDamage(enemy, target);

        if (target.targetType === "building") {
          this.damageBuilding(target, attackDamage);
        } else {
          this.damageShield(target, attackDamage);

          if (enemy.type === "breaker") {
            this.floatText(target.slot.x, target.slot.y - 42, `-${attackDamage}`, "#f472b6");
          }
        }

        if (enemy.type === "ranged") {
          this.fireRangedShot(enemy, target);
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
    if (this.gameState !== "playing") return;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      if (enemy.dead) continue;

      if (enemy.attackTarget) {
        if (this.isEnemyAttackTargetValid(enemy, enemy.attackTarget)) {
          continue;
        }

        this.clearEnemyTarget(enemy);
      }

      if (enemy.type === "ranged") {
        const rangedTarget = this.findRangedTarget(enemy);

        if (rangedTarget) {
          this.startRangedEnemyAttack(enemy, rangedTarget);
          continue;
        }
      }

      enemy.lastX = enemy.x;
      enemy.x += enemy.speed * enemy.direction * dt;
      enemy.container.x = enemy.x;

      const blockingTarget = this.findBlockingTarget(enemy);

      if (blockingTarget) {
        if (enemy.type === "leaper" && this.tryLeaperJump(enemy, blockingTarget)) {
          continue;
        }

        this.startEnemyAttack(enemy, blockingTarget);
        continue;
      }

      const hitPlanet = enemy.direction < 0
        ? enemy.x <= this.planetX + 65
        : enemy.x >= this.planetX - 65;

      if (hitPlanet) {
        this.damagePlanet(enemy.damage);
        this.destroyEnemy(enemy, false);
        if (this.isGameOver) return;
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

  findRangedTarget(enemy) {
    const candidates = [];

    for (const building of this.buildings) {
      if (this.isValidEnemyTarget(enemy, building)) {
        candidates.push(building);
      }
    }

    for (const shield of this.shields) {
      if (this.isValidEnemyTarget(enemy, shield)) {
        candidates.push(shield);
      }
    }

    return candidates
      .map((target) => ({
        target,
        distance: (this.getEnemyTargetX(target) - enemy.x) * enemy.direction
      }))
      .filter(({ distance }) => distance >= 0 && distance <= enemy.attackRange)
      .sort((left, right) => left.distance - right.distance)[0]?.target ?? null;
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

  tryLeaperJump(enemy, target) {
    if (enemy.hasLeaped || enemy.leapAttempted || !this.isValidEnemyTarget(enemy, target)) return false;

    enemy.leapAttempted = true;

    const landingX = this.getLeaperLandingX(enemy, target);

    if (!this.isValidLeaperLanding(enemy, target, landingX)) return false;

    enemy.hasLeaped = true;
    enemy.isLeaping = true;
    this.clearEnemyTarget(enemy);
    enemy.x = landingX;
    enemy.lastX = landingX;
    enemy.container.x = landingX;

    this.tweens.add({
      targets: enemy.container,
      alpha: 0.18,
      duration: 90,
      yoyo: true,
      onComplete: () => {
        if (!enemy.dead && enemy.container?.active) {
          enemy.container.setAlpha(1);
          enemy.isLeaping = false;
        }
      }
    });

    return true;
  }

  getLeaperLandingX(enemy, target) {
    return this.getEnemyTargetX(target) + enemy.direction * this.cellW;
  }

  isValidLeaperLanding(enemy, target, landingX) {
    if (!Number.isFinite(landingX)) return false;

    const minX = this.startX - this.cellW / 2;
    const maxX = this.startX + (this.cols - 1) * this.cellW + this.cellW / 2;
    const planetBoundary = enemy.direction < 0
      ? this.planetX + 65 + enemy.radius
      : this.planetX - 65 - enemy.radius;

    if (landingX < minX || landingX > maxX) return false;
    if (enemy.direction < 0 && landingX <= planetBoundary) return false;
    if (enemy.direction > 0 && landingX >= planetBoundary) return false;

    const nearbyTargets = [...this.buildings, ...this.shields];
    return !nearbyTargets.some((candidate) => {
      if (candidate === target || !this.isValidEnemyTarget(enemy, candidate)) return false;
      return Math.abs(this.getEnemyTargetX(candidate) - landingX) < this.cellW * 0.45;
    });
  }

  startRangedEnemyAttack(enemy, target) {
    if (!this.isEnemyAttackTargetValid(enemy, target)) return;

    enemy.attackTarget = target;
    enemy.attackTimer = 0;
  }

  getEnemyTargetX(target) {
    return target.targetType === "shield" ? target.slot.x : target.cell.x;
  }

  isEnemyAttackTargetValid(enemy, target) {
    if (!this.isValidEnemyTarget(enemy, target)) return false;

    if (enemy.type !== "ranged") return true;

    const distance = (this.getEnemyTargetX(target) - enemy.x) * enemy.direction;
    return distance >= 0 && distance <= enemy.attackRange;
  }

  getEnemyAttackDamage(enemy, target) {
    const multiplier = target?.targetType === "shield" ? enemy.shieldDamageMultiplier : 1;
    return Math.max(1, Math.round(enemy.damage * multiplier));
  }

  isValidEnemyTarget(enemy, target) {
    if (!enemy || enemy.dead || !target || target.destroyed) return false;
    if (target.wing !== this.activeWing) return false;
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
    if (this.isGameOver || this.gameState !== "playing") return;

    this.planetHp = Math.max(0, this.planetHp - amount);

    this.floatText(this.planetX, this.planetY - 78, `-${amount}`, "#fb7185");
    this.showMessage("星球受损", "danger");

    if (this.planetHp <= 0) {
      this.triggerGameOver();
    } else {
      this.updateUI();
    }
  }

  updateBuildingAttacks(dt) {
    if (this.gameState !== "playing") return;

    for (const building of this.buildings) {
      if (
        building.destroyed ||
        building.wing !== this.activeWing ||
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
    const muzzleX = this.getBuildingMuzzleX(building);
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

    this.pulseBuildingVisual(building, 1.3, 80);
  }

  fireLaserBeam(building, target) {
    const color = building.id === "laser" ? 0xfacc15 : 0x38bdf8;
    const width = building.id === "laser" ? 4 : 2;
    const shot = this.addToFrontline(this.add.graphics());

    shot.setDepth(68);
    shot.lineStyle(width, color, 0.9);
    shot.beginPath();
    shot.moveTo(this.getBuildingMuzzleX(building), building.cell.y);
    shot.lineTo(target.x + target.direction * target.radius, target.y);
    shot.strokePath();

    this.tweens.add({
      targets: shot,
      alpha: 0,
      duration: 120,
      onComplete: () => shot.destroy()
    });

    this.pulseBuildingVisual(building, 1.3, 80);

    this.damageEnemy(target, building.attackDamage);
  }

  getBuildingMuzzleX(building) {
    return building.cell.x + this.getBuildingFacingDirection(building) * 18;
  }

  fireRangedShot(enemy, target) {
    const targetX = this.getEnemyTargetX(target);
    const targetY = target.targetType === "shield" ? target.slot.y : target.cell.y;
    const shot = this.addToFrontline(this.add.graphics());

    shot.setDepth(68);
    shot.lineStyle(2, 0xa78bfa, 0.9);
    shot.beginPath();
    shot.moveTo(enemy.x - enemy.direction * enemy.radius, enemy.y);
    shot.lineTo(targetX, targetY);
    shot.strokePath();

    this.tweens.add({
      targets: shot,
      alpha: 0,
      duration: 120,
      onComplete: () => shot.destroy()
    });
  }

  updateProjectiles(dt) {
    if (this.gameState !== "playing") return;

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
    if (this.gameState !== "playing" || !enemy || enemy.dead) return;

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
    enemy.hasLeaped = false;
    enemy.leapAttempted = false;
    enemy.isLeaping = false;
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

    if (giveReward) {
      this.recordEnemyKill(enemy);
    }

    if (giveReward && reward > 0) {
      this.addStarEnergy(reward);
      this.floatText(x, y - 30, `+${reward}`, "#facc15");
    } else {
      this.updateUI();
    }
  }

  damageShield(shield, amount) {
    if (!shield || shield.destroyed || shield.wing !== this.activeWing) return;

    shield.currentHp = Math.max(0, shield.currentHp - amount);
    this.updateShieldHealthBar(shield);

    if (shield.currentHp <= 0) {
      this.removeShield(shield);
      this.showMessage("护盾被击穿", "danger");
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

    const state = this.getWingState(shield.wing);
    state.shieldOccupancy.delete(shield.slotKey);
    const stateIndex = state.shields.indexOf(shield);
    if (stateIndex !== -1) state.shields.splice(stateIndex, 1);

    this.stopManagedTween(shield.ambientTween);
    shield.ambientTween = null;
    this.tweens.killTweensOf(shield.shieldCore);

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
    this.triggerGameOver();
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

  getHudNextWaveText() {
    if (this.gameState === "lost") return "防线失守";
    if (this.gameState === "won") return "守护完成";
    if (this.gameState === "stage_choice") return "阶段守护完成";
    if (this.frontlineTransitioning) return "战区转移中";

    if (!this.waveActive && this.waveSpawned === 0 && this.waveStartTimer > 0) {
      return `00:${String(Math.max(0, Math.ceil(this.waveStartTimer))).padStart(2, "0")}`;
    }

    const wave = this.getWaveConfig(this.currentWaveIndex);
    const waitingEnemies = wave ? Math.max(0, wave.count - this.waveSpawned) : 0;
    return `来袭 ${this.enemies.length}`;
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

  getMessageStyle(text, type = "info") {
    let resolvedType = type;

    if (resolvedType === "info") {
      if (/摧毁|撞击|击穿|失守|失败|威胁/.test(text)) {
        resolvedType = "danger";
      } else if (/星能不足|无法|不能|禁止|不可|请先|没有/.test(text)) {
        resolvedType = "warning";
      } else if (/补给|返还|获得|星能上限 \+/.test(text)) {
        resolvedType = "reward";
      }
    }

    const styles = {
      info: { color: UI_THEME.message.info, alpha: 0.84 },
      reward: { color: UI_THEME.message.reward, alpha: 0.92 },
      warning: { color: UI_THEME.message.warning, alpha: 0.88 },
      danger: { color: UI_THEME.message.danger, alpha: 0.9 }
    };

    return styles[resolvedType] || styles.info;
  }

  showMessage(text, type = "info") {
    const style = this.getMessageStyle(text, type);
    this.messageText.setText(text);
    this.messageText.setColor(style.color);
    this.messageText.setAlpha(style.alpha ?? UI_THEME.message.alpha);
    this.messageText.setWordWrapWidth?.(620, true);

    this.tweens.killTweensOf(this.messageContainer);
    this.messageContainer.setVisible(true);
    this.messageContainer.setActive(true);
    this.messageContainer.setPosition?.(this.W / 2, this.H * UI_LAYOUT.messageYRatio + 10);
    this.messageContainer.setScale?.(0.96);
    this.messageContainer.setAlpha(0);

    this.tweens.add({
      targets: this.messageContainer,
      alpha: 1,
      y: this.H * UI_LAYOUT.messageYRatio,
      scale: 1,
      duration: 160,
      ease: "Sine.easeOut"
    });

    this.tweens.add({
      targets: this.messageContainer,
      alpha: 0,
      delay: 1250,
      duration: 380,
      ease: "Sine.easeIn",
      onComplete: () => this.hideMessage()
    });
  }

  hideMessage() {
    this.messageContainer.setVisible(false);
    this.messageContainer.setActive(false);
    this.messageContainer.setAlpha(1);
    this.messageContainer.setScale?.(1);
  }

  updateHudValues(force = false) {
    const waveNumber = this.currentWaveIndex + 1;

    this.setTextIfChanged(this.energyText, `${Math.floor(this.starEnergy)} / ${this.maxStarEnergy}`);
    this.setTextIfChanged(this.hpText, `${this.planetHp} / 100`);
    this.setTextIfChanged(this.waveText, waveNumber);
    this.setTextIfChanged(this.frontlineText, this.getHudNextWaveText());
    this.updateEnergyCapUpgradeButtonState(force);
  }

  updateUI(force = false) {
    this.updateHudValues(force);

    for (const card of this.cards) {
      if (this.selectedCard?.id === card.data.id) {
        this.applyCardVisualState(card, "selected", force);
      } else {
        this.applyCardVisualState(card, this.starEnergy < card.data.cost ? "unavailable" : "normal", force);
      }
    }
    this.updateMeteorCardUI(force);
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
