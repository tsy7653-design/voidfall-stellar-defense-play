// 拆除返还比例：临时为 0，正式比例等待用户确认。
const DEMOLISH_REFUND_RATE = 0;
const DEMOLISH_DRAG_THRESHOLD = 8;
const ENERGY_CAP_UPGRADE_AMOUNT = 10;
const ENERGY_CAP_MAX = 100;
const ENERGY_CAP_UPGRADE_COSTS = Object.freeze({
  50: 10,
  60: 15,
  70: 22,
  80: 30,
  90: 40
});
const CARD_DRAG_THRESHOLD = 10;
const GAME_VERSION = "v0.12.0-dev";
const BASE_METEOR_DAMAGE = 18;
const METEOR_DAMAGE_PER_LEVEL = 4;
const METEOR_UPGRADE_BASE_COST = 10;
const METEOR_UPGRADE_COST_STEP = 5;
const METEOR_UPGRADE_MAX_COST = 90;
const METEOR_UPGRADE_CLICK_GUARD_MS = 160;
const BUILDING_REPAIR_CONFIG = Object.freeze({
  hpPerSecond: 8,
  energyPerSecond: 2
});
const ENGAGEMENT_HUD_MAX_SLOTS = 4;
const THREAT_HUD_SPECIAL_TYPES = new Set(["fast", "tank", "ranged", "breaker", "leaper"]);
const PORTAL_SPAWN_PULSE_COOLDOWN_MS = 180;

// 选择光场只维护一套对象，避免点击、切战区和重开时累积边框或 Tween。
const BUILDING_SELECTION_VISUAL = Object.freeze({
  baseDiameter: 68,
  minDiameter: 72,
  maxDiameter: 104,
  buildingScale: 1.42,
  shieldScale: 1.5,
  transitionDuration: 190
});

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
    backdropFill: 0x020611,
    backdropAlpha: 0.46,
    panelFill: 0x061a30,
    panelAlternateFill: 0x111333,
    panelAlpha: 0.86,
    border: 0x36c7f4,
    separator: 0x1e5d84,
    iconWell: 0x082945,
    label: "#a9c4dc",
    value: "#f4f9ff",
    muted: "#bfd1e4",
    energy: "#ffd166",
    healthy: "#68e7a2"
  },
  card: {
    barFill: 0x020611,
    tacticalFill: 0x1b0b34,
    fill: 0x061629,
    headerFill: 0x0a2640,
    imageFill: 0x071d33,
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
    fill: 0x040a18,
    headerFill: 0x14173c,
    statsFill: 0x07243d,
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
    x: 14,
    width: 216,
    rowHeight: 26,
    rows: [18, 46, 74],
    backdropHeight: 84
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
  messageYRatio: 0.42
};

// 轻量视觉特效只在事件发生时创建，并用总量上限保护高波次与手机端性能。
const VISUAL_EFFECTS = Object.freeze({
  maxTransientObjects: 112,
  backgroundStarCount: 18,
  colors: Object.freeze({
    friendly: 0x58d9ff,
    friendlyCore: 0xe8fbff,
    resource: 0x4ade80,
    meteor: 0xff9f43,
    meteorCore: 0xffe082,
    void: 0xb56cff,
    voidCore: 0xf0abfc,
    danger: 0xff5d73
  })
});

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
    this.frontlineDepthDirty = true;
    return item;
  }

  flushFrontlineDepth() {
    // Container 不自动按子对象 depth 排序；新增对象后的帧只整理一次。
    if (!this.frontlineDepthDirty) return;
    this.frontlineLayer?.sort?.("depth");
    this.frontlineDepthDirty = false;
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

  getTransientEffectScale(priority = "normal") {
    const enemyCount = this.enemies?.length || 0;
    const waveNumber = (this.currentWaveIndex || 0) + 1;
    const occupiedRatio = (this.transientVisuals?.size || 0) / VISUAL_EFFECTS.maxTransientObjects;
    let scale = 1;

    if (enemyCount >= 48 || waveNumber >= 61) scale *= 0.42;
    else if (enemyCount >= 30 || waveNumber >= 41) scale *= 0.62;
    else if (enemyCount >= 18 || waveNumber >= 25) scale *= 0.8;

    if (occupiedRatio >= 0.82) scale *= 0.35;
    else if (occupiedRatio >= 0.62) scale *= 0.62;

    if (priority === "core") return Math.max(0.55, scale);
    if (priority === "low") return Math.max(0.18, scale * 0.72);
    return Math.max(0.3, scale);
  }

  getBudgetedEffectCount(baseCount, priority = "normal") {
    const scaledCount = Math.max(priority === "core" ? 1 : 0, Math.round(baseCount * this.getTransientEffectScale(priority)));
    if (priority === "core") this.ensureTransientCapacity(Math.min(scaledCount, 3), priority);
    const available = Math.max(0, VISUAL_EFFECTS.maxTransientObjects - (this.transientVisuals?.size || 0));
    return Math.min(available, scaledCount);
  }

  canSpawnTransientVisual(count = 1) {
    this.transientVisuals ??= new Set();
    return this.transientVisuals.size + Math.max(1, count) <= VISUAL_EFFECTS.maxTransientObjects;
  }

  ensureTransientCapacity(count = 1, priority = "normal") {
    if (this.canSpawnTransientVisual(count)) return true;
    if (priority !== "core") return false;
    let reclaimCount = this.transientVisuals.size + Math.max(1, count) - VISUAL_EFFECTS.maxTransientObjects;
    for (const visual of [...this.transientVisuals]) {
      if (reclaimCount <= 0) break;
      if ((this.transientVisualPriorities?.get(visual) || "normal") === "core") continue;
      this.destroyTransientVisual(visual);
      reclaimCount--;
    }
    return this.canSpawnTransientVisual(count);
  }

  trackTransientVisual(visual, priority = "normal") {
    if (!visual) return null;
    this.transientVisuals ??= new Set();
    this.transientVisualPriorities ??= new Map();
    this.transientVisuals.add(visual);
    this.transientVisualPriorities.set(visual, priority);
    return visual;
  }

  destroyTransientVisual(visual) {
    if (!visual) return;
    this.tweens?.killTweensOf?.(visual);
    this.transientVisuals?.delete(visual);
    this.transientVisualPriorities?.delete(visual);
    this.enemyDeathVisuals?.delete(visual);
    visual.destroy?.();
  }

  clearTransientVisuals() {
    for (const visual of this.transientVisuals || []) {
      this.destroyTransientVisual(visual);
    }
    this.transientVisuals = new Set();
    this.transientVisualPriorities = new Map();
  }

  addTransientCircle(x, y, radius, color, alpha, depth = 72, inFrontline = true, priority = "normal") {
    if (!this.add?.circle || !this.ensureTransientCapacity(1, priority)) return null;
    const circle = this.add.circle(x, y, radius, color, alpha);
    const visual = inFrontline ? this.addToFrontline(circle) : circle;
    visual.setDepth?.(depth);
    return this.trackTransientVisual(visual, priority);
  }

  playPulseRing(x, y, {
    radius = 18,
    color = VISUAL_EFFECTS.colors.friendly,
    alpha = 0.7,
    scale = 1.8,
    duration = 260,
    strokeWidth = 2,
    depth = 72,
    inFrontline = true,
    priority = "normal"
  } = {}) {
    const ring = this.addTransientCircle(x, y, radius, color, 0.015, depth, inFrontline, priority);
    if (!ring) return null;
    ring.setStrokeStyle?.(strokeWidth, color, alpha);
    this.tweens.add({
      targets: ring,
      scale,
      alpha: 0,
      duration,
      ease: "Sine.easeOut",
      onComplete: () => this.destroyTransientVisual(ring)
    });
    return ring;
  }

  playRadialSparks(x, y, color, count = 5, distance = 34, duration = 320, depth = 73, priority = "normal") {
    const sparkCount = this.getBudgetedEffectCount(count, priority);
    const randomBetween = (min, max) => Phaser.Math?.FloatBetween?.(min, max) ?? (min + max) / 2;

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + randomBetween(-0.22, 0.22);
      const spark = this.addTransientCircle(x, y, randomBetween(1.2, 2.4), color, 0.9, depth, true, priority);
      if (!spark) break;
      const travel = distance * randomBetween(0.72, 1.08);
      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * travel,
        y: y + Math.sin(angle) * travel,
        scale: 0.35,
        alpha: 0,
        duration,
        ease: "Cubic.easeOut",
        onComplete: () => this.destroyTransientVisual(spark)
      });
    }
  }

  cleanupSceneAnimations() {
    for (const tween of this.sceneAmbientTweens || []) this.stopManagedTween(tween);
    this.sceneAmbientTweens = [];

    for (const building of this.buildings || []) {
      this.stopManagedTween(building.ambientTween);
      this.stopManagedTween(building.feedbackTween);
      this.stopManagedTween(building.deployTween);
      building.ambientTween = null;
      building.feedbackTween = null;
      building.deployTween = null;
    }

    for (const shield of this.shields || []) {
      this.stopManagedTween(shield.ambientTween);
      this.stopManagedTween(shield.deployTween);
      shield.ambientTween = null;
      shield.deployTween = null;
    }

    this.stopManagedTween(this.selectionTransitionTween);
    this.stopManagedTween(this.selectionAmbientTween);
    this.stopManagedTween(this.portalSpawnPulseTween);
    this.stopManagedTween(this.portalSpawnCoreTween);
    this.selectionTransitionTween = null;
    this.selectionAmbientTween = null;
    this.portalSpawnPulseTween = null;
    this.portalSpawnCoreTween = null;
    this.hideBuildingSelection(true);

    this.clearSupplyVisuals();
    this.clearTransientVisuals();
    for (const visual of this.enemyDeathVisuals || []) {
      this.tweens?.killTweensOf?.(visual);
      visual?.destroy?.();
    }
    this.enemyDeathVisuals = new Set();
  }

  preload() {
    for (const [key, path] of Object.entries(GAME_ASSET_PATHS)) {
      if (!this.hasTexture(key)) this.load.image(key, path);
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
      this.destroyTransientVisual(visual);
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
    this.clearBuildingSelection(true);
    this.destroySettingsMenu();
    this.demolishMode = false;
    this.updateDemolishButtonState();
    this.updateMeteorPreview(this.input.activePointer);
    this.hideMessage();
    this.pauseGameplayTweens();
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

  getDefenseDisplayRows(lines) {
    const rows = [];
    for (const line of lines) {
      const separator = line.indexOf("：");
      const prefix = separator < 0 ? "" : line.slice(0, separator + 1);
      const entries = separator < 0 ? line : line.slice(separator + 1);
      let row = "";
      for (const entry of entries.split("，")) {
        const next = row ? `${row}，${entry}` : `${prefix}${entry}`;
        if (next.length > 32 && row) { rows.push(row); row = `${prefix}${entry}`; }
        else row = next;
      }
      if (row) rows.push(row);
    }
    return rows;
  }

  showEndScreen({ result, summary }) {
    if (this.endScreenUi || !summary) return false;

    const isVictory = result === "victory";
    const defenseLines = this.formatFinalDefenseLines(summary.survivingBuildings);
    const defenseRows = this.getDefenseDisplayRows(defenseLines);
    const pageSize = 5;
    const pageCount = Math.max(1, Math.ceil(defenseRows.length / pageSize));
    const visibleRows = Math.min(pageSize, defenseRows.length);
    const panelWidth = Math.min(620, this.W * 0.82);
    const panelHeight = Math.min(this.H - 80, 340 + visibleRows * 29 + (pageCount > 1 ? 38 : 0));
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

    const defenseTexts = [];
    let defensePage = 0;
    if (defenseRows.length === 0) {
      const emptyLine = addPanelText(panelX, panelTop + 224, isVictory
        ? "最终防线：防线虽已耗尽，但晨曦星成功获救"
        : "最终防线：已全数失守", {
        fontSize: UI_THEME.type.panelBody,
        color: UI_THEME.panel.body
      });
      emptyLine.setOrigin(0.5, 0);
    } else {
      defenseRows.slice(0, pageSize).forEach((line, index) => {
        const text = addPanelText(panelX - panelWidth / 2 + 42, panelTop + 220 + index * 29, line, {
          fontSize: "16px",
          color: UI_THEME.panel.value
        });
        text.setPadding(0, 2, 0, 2);
        defenseTexts.push(text);
      });
    }

    let defensePagination = null;
    if (pageCount > 1) {
      const pageY = panelTop + 240 + visibleRows * 29;
      const label = addPanelText(panelX, pageY, `1 / ${pageCount}`, { fontSize: "14px", color: UI_THEME.panel.body });
      label.setOrigin(0.5);
      const showPage = (offset) => {
        defensePage = Math.max(0, Math.min(pageCount - 1, defensePage + offset));
        defenseTexts.forEach((text, index) => this.setTextIfChanged(text, defenseRows[defensePage * pageSize + index] || ""));
        this.setTextIfChanged(label, `${defensePage + 1} / ${pageCount}`);
      };
      const elements = [];
      const previous = this.createModalButton(elements, panelX - 106, pageY, 76, "‹", () => showPage(-1), true, 202);
      const next = this.createModalButton(elements, panelX + 106, pageY, 76, "›", () => showPage(1), true, 202);
      defensePagination = { previous: previous.button, next: next.button, label };
    }

    const restartButton = this.add.rectangle(panelX - 118, panelTop + panelHeight - 43, 210, 56, UI_THEME.panel.buttonFill, 0.98);
    restartButton.setStrokeStyle(1, UI_THEME.panel.buttonBorder, 0.94);
    restartButton.setDepth(202);
    restartButton.setInteractive({ useHandCursor: true });

    const restartLabel = addPanelText(panelX - 118, panelTop + panelHeight - 44, "再来一次", {
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

    const menuButton = this.createModalButton([], panelX + 118, panelTop + panelHeight - 43, 210, "返回星港", () => this.showMenuConfirmation(), true, 202);
    const ui = { overlay, panel, panelHeaderBand, statsBand, panelAccent, restartButton, restartLabel, menuButton: menuButton.button, result, defenseTexts, defensePagination };
    this.endScreenUi = ui;
    if (!isVictory) this.gameOverUi = ui;
    return true;
  }

  restartGame() {
    if ((!this.isGameOver && this.gameState !== "won") || this.restartRequested || !this.scene?.restart) return false;

    this.endScreenUi?.restartButton?.disableInteractive?.();
    this.gameOverUi?.restartButton?.disableInteractive?.();
    return this.performSceneRestart();
  }

  destroyFixedUi(ui) {
    for (const element of ui?.elements || []) element?.destroy?.();
  }

  createModalButton(elements, x, y, width, labelText, handler, secondary = false, depth = 192) {
    const fill = secondary ? UI_THEME.panel.secondaryFill : UI_THEME.panel.buttonFill;
    const hoverFill = secondary ? UI_THEME.panel.secondaryHoverFill : UI_THEME.panel.buttonHoverFill;
    const border = secondary ? UI_THEME.panel.secondaryBorder : UI_THEME.panel.buttonBorder;
    const button = this.add.rectangle(x, y, width, 50, fill, 0.98);
    button.setStrokeStyle(1, border, 0.9);
    button.setDepth(depth);
    button.setInteractive({ useHandCursor: true });
    const label = this.makeText(x, y - 1, labelText, {
      fontSize: UI_THEME.type.button,
      color: UI_THEME.panel.value,
      fontStyle: "bold"
    });
    label.setOrigin(0.5, 0.5);
    label.setDepth(depth + 1);
    elements.push(button, label);
    button.on("pointerover", () => button.setFillStyle(hoverFill, 1));
    button.on("pointerout", () => button.setFillStyle(fill, 0.98));
    button.on("pointerdown", () => {
      this.beginFixedUiInteraction();
      handler();
    });
    return { button, label };
  }

  pauseGameplayTweens() {
    if (this.gameplayTweensPaused) return false;
    this.tweens?.pauseAll?.();
    this.gameplayTweensPaused = true;
    return true;
  }

  resumeGameplayTweens() {
    if (!this.gameplayTweensPaused) return false;
    this.tweens?.resumeAll?.();
    this.gameplayTweensPaused = false;
    this.syncWingAnimationState();
    return true;
  }

  clearGameplayInteractionState() {
    this.cancelPointerInteraction();
    this.clearCardSelection();
    this.clearBuildingSelection(true);
    this.destroySettingsMenu();
    this.setDemolishMode(false, false);
    this.updateMeteorPreview(this.input?.activePointer);
  }

  showStartScreen() {
    if (this.startScreenUi || this.gameState !== "ready") return false;
    const elements = [];
    const track = (element) => {
      elements.push(element);
      return element;
    };
    const x = this.W / 2;
    const y = this.H / 2 - 12;
    const overlay = track(this.add.rectangle(this.W / 2, this.H / 2, this.W, this.H, 0x020617, 0.28));
    overlay.setDepth(160).setInteractive();
    overlay.on("pointerdown", () => this.beginFixedUiInteraction());
    const panel = track(this.add.rectangle(x, y, 430, 220, UI_THEME.panel.fill, 0.9));
    panel.setStrokeStyle(1, UI_THEME.panel.border, 0.68).setDepth(161);
    const accent = track(this.add.rectangle(x, y - 96, 330, 2, UI_THEME.panel.victory, 0.84));
    accent.setDepth(162);
    const title = track(this.makeText(x, y - 76, "星辰寂灭：虚空防线", {
      fontSize: "30px",
      color: UI_THEME.panel.victory,
      fontStyle: "bold"
    }));
    title.setOrigin(0.5, 0).setDepth(162);
    const copy = track(this.makeText(x, y - 28, "晨曦星防线已就绪", {
      fontSize: "16px",
      color: UI_THEME.panel.body
    }));
    copy.setOrigin(0.5, 0).setDepth(162);
    const startButton = this.createModalButton(elements, x, y + 58, 220, "开始守护", () => this.startGame(), false, 162);
    this.startScreenUi = { elements, overlay, panel, startButton: startButton.button };
    return true;
  }

  startGame(fromMenu = false) {
    if (this.gameState !== "ready" || (!this.startScreenUi && !fromMenu)) return false;
    const startUi = this.startScreenUi;
    startUi?.startButton?.disableInteractive?.();
    this.startScreenUi = null;
    this.gameState = "playing";
    this.guardElapsedSeconds = 0;
    this.waveStartTimer = Math.max(0, this.waveStartTimer || 2.5);
    const fadeTween = startUi && this.tweens?.add?.({
      targets: startUi.elements,
      alpha: 0,
      duration: 180,
      ease: "Sine.easeOut",
      onComplete: () => this.destroyFixedUi(startUi)
    });
    if (!fadeTween) this.destroyFixedUi(startUi);
    this.updateHudValues(true);
    this.showMessage("守护开始", "info");
    return true;
  }

  showPauseScreen() {
    if (this.pauseUi || this.gameState !== "paused") return false;
    const elements = [];
    const track = (element) => {
      elements.push(element);
      return element;
    };
    const x = this.W / 2;
    const y = this.H / 2;
    const overlay = track(this.add.rectangle(x, y, this.W, this.H, 0x020617, 0.72));
    overlay.setDepth(180).setInteractive();
    overlay.on("pointerdown", () => this.beginFixedUiInteraction());
    const panel = track(this.add.rectangle(x, y + 20, 500, 330, UI_THEME.panel.fill, 0.97));
    panel.setStrokeStyle(1, UI_THEME.panel.border, 0.74).setDepth(181);
    const title = track(this.makeText(x, y - 94, "晨曦星正在等待你", {
      fontSize: UI_THEME.type.panelTitle,
      color: UI_THEME.panel.victory,
      fontStyle: "bold"
    }));
    title.setOrigin(0.5, 0).setDepth(182);
    const copy = track(this.makeText(x, y - 42, "防线已暂时静止", {
      fontSize: UI_THEME.type.panelBody,
      color: UI_THEME.panel.body
    }));
    copy.setOrigin(0.5, 0).setDepth(182);
    const continueButton = this.createModalButton(elements, x - 118, y + 70, 210, "继续守护", () => this.resumeGame(), false, 182);
    const restartButton = this.createModalButton(elements, x + 118, y + 70, 210, "重新开始", () => this.showRestartConfirmation(), true, 182);
    const menuButton = this.createModalButton(elements, x, y + 136, 446, "返回星港", () => this.showMenuConfirmation(), true, 182);
    this.pauseUi = { elements, overlay, panel, continueButton: continueButton.button, restartButton: restartButton.button, menuButton: menuButton.button };
    return true;
  }

  pauseGame() {
    if (this.gameState !== "playing" || this.pauseUi) return false;
    this.destroySettingsMenu();
    this.clearGameplayInteractionState();
    this.gameState = "paused";
    this.pauseGameplayTweens();
    this.showPauseScreen();
    this.updateHudValues(true);
    return true;
  }

  resumeGame() {
    if (this.gameState !== "paused" || this.restartConfirmUi || this.menuConfirmUi) return false;
    this.destroyFixedUi(this.pauseUi);
    this.pauseUi = null;
    this.gameState = "playing";
    this.resumeGameplayTweens();
    this.updateHudValues(true);
    this.showMessage("守护继续", "info");
    return true;
  }

  showRestartConfirmation() {
    if (this.restartConfirmUi || this.restartRequested || ["lost", "won", "stage_choice"].includes(this.gameState)) return false;
    this.destroySettingsMenu();
    this.restartConfirmReturnState = this.gameState;
    if (this.gameState === "playing") {
      this.clearGameplayInteractionState();
      this.gameState = "paused";
      this.pauseGameplayTweens();
    }

    const elements = [];
    const track = (element) => {
      elements.push(element);
      return element;
    };
    const x = this.W / 2;
    const y = this.H / 2;
    const overlay = track(this.add.rectangle(x, y, this.W, this.H, 0x020617, 0.8));
    overlay.setDepth(190).setInteractive();
    overlay.on("pointerdown", () => this.beginFixedUiInteraction());
    const panel = track(this.add.rectangle(x, y, 530, 270, UI_THEME.panel.fill, 0.98));
    panel.setStrokeStyle(1, UI_THEME.panel.danger, 0.65).setDepth(191);
    const title = track(this.makeText(x, y - 92, "要放弃这次守护吗？", {
      fontSize: "28px",
      color: UI_THEME.panel.danger,
      fontStyle: "bold"
    }));
    title.setOrigin(0.5, 0).setDepth(192);
    const copy = track(this.makeText(x, y - 40, "晨曦星会等待下一次启航。", {
      fontSize: UI_THEME.type.panelBody,
      color: UI_THEME.panel.body
    }));
    copy.setOrigin(0.5, 0).setDepth(192);
    const cancel = this.createModalButton(elements, x - 118, y + 70, 210, "继续守护", () => this.cancelRestartConfirmation(), false, 192);
    const confirm = this.createModalButton(elements, x + 118, y + 70, 210, "重新开始", () => this.performSceneRestart(), true, 192);
    this.restartConfirmUi = { elements, overlay, panel, cancelButton: cancel.button, restartButton: confirm.button };
    return true;
  }

  cancelRestartConfirmation() {
    if (!this.restartConfirmUi) return false;
    const returnState = this.restartConfirmReturnState;
    this.destroyFixedUi(this.restartConfirmUi);
    this.restartConfirmUi = null;
    this.restartConfirmReturnState = null;
    if (returnState === "playing") {
      this.gameState = "playing";
      this.resumeGameplayTweens();
      this.updateHudValues(true);
    }
    return true;
  }

  performSceneRestart() {
    if (this.restartRequested || this.returnToMenuRequested || this.menuConfirmUi || !this.scene?.restart) return false;
    this.restartRequested = true;
    this.restartConfirmUi?.restartButton?.disableInteractive?.();
    this.clearSupplyVisuals();
    this.stopBuildingRepair();
    this.tweens?.resumeAll?.();
    this.gameplayTweensPaused = false;
    // 重开不能沿用上一次由星港传入的自动开始标志，保留原 ready 流程。
    this.scene.restart({ fromMenu: false });
    return true;
  }

  showMenuConfirmation() {
    if (this.menuConfirmUi || this.restartRequested || this.returnToMenuRequested ||
        !["paused", "lost", "won"].includes(this.gameState)) return false;
    const elements = [];
    const x = this.W / 2;
    const y = this.H / 2;
    const overlay = this.add.rectangle(x, y, this.W, this.H, 0x020617, 0.78).setDepth(210).setInteractive();
    const panel = this.add.rectangle(x, y, 550, 270, UI_THEME.panel.fill, 0.98).setDepth(211);
    panel.setStrokeStyle(1, UI_THEME.panel.border, 0.7);
    elements.push(overlay, panel);
    const title = this.makeText(x, y - 65, "结束本次守护并返回星港？", {
      fontSize: "26px", color: UI_THEME.panel.value, fontStyle: "bold"
    }).setOrigin(0.5).setDepth(212);
    const copy = this.makeText(x, y - 8, "本局防线与进度将被清空。", {
      fontSize: "18px", color: UI_THEME.panel.body
    }).setOrigin(0.5).setDepth(212);
    elements.push(title, copy);
    const cancel = this.createModalButton(elements, x - 118, y + 76, 210, "留在此处", () => this.cancelMenuConfirmation(), true, 212);
    const confirm = this.createModalButton(elements, x + 118, y + 76, 210, "返回星港", () => this.returnToMainMenu(), false, 212);
    this.menuConfirmUi = { elements, overlay, cancelButton: cancel.button, confirmButton: confirm.button };
    return true;
  }

  cancelMenuConfirmation() {
    if (!this.menuConfirmUi || this.returnToMenuRequested) return false;
    this.destroyFixedUi(this.menuConfirmUi);
    this.menuConfirmUi = null;
    return true;
  }

  returnToMainMenu() {
    if (!this.menuConfirmUi || this.returnToMenuRequested || this.restartRequested) return false;
    this.returnToMenuRequested = true;
    this.gameState = "menu";
    this.input.enabled = false;
    this.clearGameplayInteractionState();
    this.time.removeAllEvents();
    this.tweens.resumeAll();
    this.tweens.killAll();
    // Scene.start 关闭当前场景；SHUTDOWN 完成视觉清理后再释放本局数据。
    this.scene.start("StellarTerminal");
    return true;
  }

  clearBattleSessionForMenu() {
    this.resetRunStats();
    this.resetSupplyState();
    this.resetMeteorProgress();
    this.buildings = [];
    this.shields = [];
    this.enemies = [];
    this.projectiles = [];
    this.gridCells = [];
    this.shieldSlots = [];
    this.cards = [];
    this.wingStates = this.createWingStates();
    this.storedCollectors = [];
    this.waveQueue = [];
    this.waveActive = false;
    this.waveSpawned = 0;
    this.currentWaveIndex = 0;
    this.waveSpawnTimer = 0;
    this.waveStartTimer = 2.5;
    this.guardElapsedSeconds = 0;
    this.energyRegenTimer = 0;
    this.starEnergy = 10;
    this.maxStarEnergy = 50;
    this.planetHp = 100;
    this.stageChoiceWaves = new Set();
    this.stageChoiceActive = false;
    this.isGameOver = false;
    this.activeWing = "right";
    this.gameEndSummary = null;
    this.gameOverSummary = null;
    this.menuConfirmUi = null;
    this.endScreenUi = null;
    this.gameOverUi = null;
    this.pauseUi = null;
    this.frontlineLayer = null;
    this.battleEntryObjects = null;
  }

  enterBattleFromMenu() {
    // 只渐入本次创建的独立对象，不改 Camera alpha，也不重建任何 UI。
    this.input.enabled = false;
    const ambient = this.tweens.getTweens();
    for (const tween of ambient) tween.pause();
    this.battleEntryObjects = this.children.list.filter((object) => object !== this.battlefieldBackground)
      .map((object) => ({ object, alpha: object.alpha }));
    for (const { object } of this.battleEntryObjects) object.setAlpha(0);
    this.tweens.addCounter({
      from: 0, to: 1, duration: 320, ease: "Sine.easeOut",
      onUpdate: (tween) => {
        for (const { object, alpha } of this.battleEntryObjects || []) object.setAlpha(alpha * tween.getValue());
      },
      onComplete: () => {
        this.battleEntryObjects = null;
        this.input.enabled = true;
        for (const tween of ambient) tween.resume();
        this.syncWingAnimationState();
        this.startGame(true);
      }
    });
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
    this.clearBuildingSelection(true);
    this.destroySettingsMenu();
    this.demolishMode = false;
    this.updateDemolishButtonState();
    this.updateMeteorPreview(this.input.activePointer);
    this.pauseGameplayTweens();

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

    if (!this.add || !this.tweens?.add || !this.ensureTransientCapacity(5, "core")) {
      finish();
      return;
    }

    const sourceX = this.planetX + (this.frontlineLayer?.x || 0) + (this.enemyDirection < 0 ? 54 : -54);
    const sourceY = this.planetY - 8;
    const targetX = this.energyText?.x || 320;
    const targetY = this.energyText?.y || 18;
    // 补给从战场飞向固定 HUD，飞行对象使用屏幕坐标，不再二次叠加平移。
    const outerGlow = this.trackTransientVisual(this.add.circle(sourceX, sourceY, 18, 0x38bdf8, 0.12), "core");
    const pod = this.trackTransientVisual(this.add.rectangle(sourceX, sourceY, 18, 14, 0x93c5fd, 0.98), "core");
    const core = this.trackTransientVisual(this.add.circle(sourceX, sourceY, 5, 0xfef3c7, 0.98), "core");
    const trail = this.trackTransientVisual(this.add.circle(sourceX, sourceY, 12, 0x60a5fa, 0.22), "core");
    const trailCore = this.trackTransientVisual(this.add.circle(sourceX, sourceY, 4, 0x67e8f9, 0.48), "core");

    pod.setStrokeStyle(2, 0xdbeafe, 0.95).setDepth(96);
    core.setDepth(97);
    trail.setDepth(95);
    outerGlow.setDepth(94);
    trailCore.setDepth(95);
    this.supplyVisuals = [outerGlow, pod, core, trail, trailCore];

    this.playPulseRing(sourceX - (this.frontlineLayer?.x || 0), sourceY, {
      radius: 18,
      color: 0x67e8f9,
      alpha: 0.68,
      scale: 1.8,
      duration: 280,
      depth: 93
    });

    this.tweens.add({
      targets: [outerGlow, pod, core, trail, trailCore],
      x: targetX,
      y: targetY,
      duration: 820,
      ease: "Cubic.easeInOut",
      onComplete: () => {
        this.clearSupplyVisuals();
        if (!this.ensureTransientCapacity(1, "core")) { finish(); return; }
        const burst = this.trackTransientVisual(this.add.circle(targetX, targetY, 14, 0x93c5fd, 0.55).setDepth(98), "core");
        this.supplyVisuals.push(burst);
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
    this.resumeGameplayTweens();
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
    this.clearBuildingSelection(true);
    this.destroySettingsMenu();
    this.demolishMode = false;
    this.updateDemolishButtonState();
    this.updateMeteorPreview(this.input.activePointer);
    this.hideMessage();
    this.updateUI();
    this.showVictoryScreen();
    return true;
  }

  create(data = {}) {
    this.cameras.main.setRoundPixels(true);

    this.W = this.scale.width;
    this.H = this.scale.height;
    this.sceneAmbientTweens = [];
    this.transientVisuals = new Set();
    this.transientVisualPriorities = new Map();
    this.enemyDeathVisuals = new Set();
    this.backgroundDriftLayers = [];
    this.events?.once?.(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupSceneAnimations();
      if (this.returnToMenuRequested) this.clearBattleSessionForMenu();
    });

    // 星能系统
    this.starEnergy = 10;
    this.maxStarEnergy = 50;
    this.energyRegen = 1;
    this.energyRegenInterval = 5;
    this.energyRegenTimer = 0;
    this.lastBuildingUpgradeAt = -Infinity;
    this.pointerOwnerId = null;

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
    this.returnToMenuRequested = false;
    this.menuConfirmUi = null;
    this.battleEntryObjects = null;
    this.input.enabled = true;
    this.stageChoiceActive = false;
    this.stageChoiceResolved = false;
    this.stageChoiceWave = 0;
    this.stageChoiceWaves = new Set();
    this.stageChoiceUi = null;
    this.gameEndSummary = null;
    this.gameState = "ready";
    this.guardElapsedSeconds = 0;
    this.guardTimerDisplay = "";
    this.gameplayTweensPaused = false;
    this.startScreenUi = null;
    this.settingsMenuUi = null;
    this.pauseUi = null;
    this.restartConfirmUi = null;
    this.restartConfirmReturnState = null;
    this.selectedBuildingTarget = null;
    this.buildingSelectionVisual = null;
    this.selectionTransitionTween = null;
    this.selectionAmbientTween = null;
    this.selectionTransitionSerial = 0;
    this.portalSpawnPulseTween = null;
    this.portalSpawnCoreTween = null;
    this.lastPortalSpawnPulseAt = Number.NEGATIVE_INFINITY;
    this.repairTarget = null;
    this.repairAccumulator = 0;
    this.engagementHudAccumulator = 0;
    this.frontlineTransitioning = false;
    this.demolishMode = false;
    this.pendingDemolishTarget = null;
    this.pendingPlacementTarget = null;
    this.pendingBuildingSelection = null;
    this.pendingMeteorCast = null;
    this.pointerPressStart = null;
    this.pointerDragging = false;
    this.fixedUiPointerActive = false;
    this.pointerIsTouch = false;
    this.battlefieldPanStartX = 0;
    this.cardDragState = { active: false, candidateCard: null, card: null, startX: 0, startY: 0, ghost: null, outline: null, valid: false };

    // 建筑无限升级配置：属性和费用均由统一计算接口生成，不维护独立升级计时器。
    this.buildingProgressionConfig = createBuildingProgressionConfig();

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
    this.enemySpawnConfig = createEnemySpawnConfig();

    this.createBackground();
    this.createTitle();
    // 战场层单独移动，换边时 UI 和卡牌区保持稳定。
    this.frontlineLayer = this.add.container(0, 0);
    this.createPlanet();
    this.createPortal();
    this.createBattlefield();
    this.createBuildingSelectionVisual();
    this.createCards();
    this.createUI();
    this.createMeteorPreview();
    if (!data.fromMenu) this.showStartScreen();

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
    this.input.on("pointercancel", () => this.cancelPointerInteraction());
    this.input.on("pointerupoutside", () => this.cancelPointerInteraction());
    this.input.on("gameout", () => this.cancelPointerInteraction());
    if (data.fromMenu) this.enterBattleFromMenu();
  }

  update(time, delta) {
    this.flushFrontlineDepth();
    const dt = delta / 1000;

    if (this.gameState !== "playing") return;

    this.updateGuardTimer(dt);
    this.updateStarEnergy(dt);
    this.updateCollectors(dt);
    this.updateBuildingRepair(dt);
    this.updateEngagementHud(dt);

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
    fallbackBackground.setScrollFactor?.(0);

    if (this.hasTexture("bg_space_battlefield_hd")) {
      const source = this.textures.get("bg_space_battlefield_hd").getSourceImage();
      const coverScale = Math.max(W / source.width, H / source.height);

      this.battlefieldBackground = this.add.image(W / 2, H / 2, "bg_space_battlefield_hd");
      this.battlefieldBackground.setScale(coverScale);
      this.battlefieldBackground.setAlpha(1);
      this.battlefieldBackground.setDepth(-999);
      this.battlefieldBackground.setScrollFactor?.(0);
    }

    this.backgroundShade = this.add.rectangle(W / 2, H / 2, W, H, 0x020617, 0.1);
    this.backgroundShade.setDepth(-998);
    this.backgroundShade.setScrollFactor?.(0);

    // 两层低密度星尘只做极慢位移，增强深度但不让整个背景晃动。
    for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
      const stars = [];
      const count = VISUAL_EFFECTS.backgroundStarCount / 2;

      for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(-20, W + 20);
        const y = Phaser.Math.Between(10, H - 135);
        const radius = Phaser.Math.FloatBetween(0.6, layerIndex === 0 ? 1.25 : 1.65);
        const color = layerIndex === 0 ? 0xd9f4ff : 0xb5a8ff;
        const alpha = Phaser.Math.FloatBetween(0.12, layerIndex === 0 ? 0.3 : 0.22);
        stars.push(this.add.circle(x, y, radius, color, alpha));
      }

      const layer = this.add.container(0, 0, stars);
      layer.setDepth(-997 + layerIndex);
      layer.setScrollFactor?.(0);
      this.backgroundDriftLayers.push(layer);
      this.addSceneAmbientTween({
        targets: layer,
        x: layerIndex === 0 ? 12 : -9,
        y: layerIndex === 0 ? -4 : 5,
        duration: layerIndex === 0 ? 24000 : 31000,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1
      });
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

    const planetHalo = keepPlanet(this.add.circle(this.planetX, this.planetY, 108, 0x60a5fa, 0.07));
    const planetGlow1 = keepPlanet(this.add.circle(this.planetX, this.planetY, 94, 0x1d4ed8, 0.11));
    const planetGlow2 = keepPlanet(this.add.circle(this.planetX, this.planetY, 76, 0x60a5fa, 0.16));
    const planetShieldRing = keepPlanet(this.add.circle(this.planetX, this.planetY, 66, 0x0ea5e9, 0.025));
    planetShieldRing.setStrokeStyle(2, 0x67e8f9, 0.46);
    const planetShieldInnerRing = keepPlanet(this.add.circle(this.planetX, this.planetY, 61, 0x020617, 0.01));
    planetShieldInnerRing.setStrokeStyle(1, 0xe0f7ff, 0.2);
    const planetWarningGlow = keepPlanet(this.add.circle(this.planetX, this.planetY, 70, 0xfb7185, 0.01));
    planetWarningGlow.setStrokeStyle(2, 0xfb7185, 0.28);
    planetWarningGlow.setVisible(false);
    this.planetHalo = planetHalo;
    this.planetGlow = planetGlow2;
    this.planetShieldRing = planetShieldRing;
    this.planetShieldInnerRing = planetShieldInnerRing;
    this.planetWarningGlow = planetWarningGlow;

    if (this.hasTexture("home_planet_dawnstar")) {
      // 正式主体保持静止，外围光晕单独提供轻微能量变化。
      this.planetBody = keepPlanet(this.add.image(this.planetX, this.planetY, "home_planet_dawnstar").setScale(0.23));
    } else {
      // 正式图片加载失败时保留原有程序绘制晨曦星。
      this.planetBody = keepPlanet(this.add.circle(this.planetX, this.planetY, 58, 0x0f3b82, 1));
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

    const planetMotes = [
      this.add.circle(78, -8, 2.2, 0xe0f7ff, 0.62),
      this.add.circle(-64, 34, 1.7, 0x67e8f9, 0.5),
      this.add.circle(18, 70, 1.5, 0x93c5fd, 0.42)
    ];
    const planetMoteOrbit = keepPlanet(this.add.container(this.planetX, this.planetY, planetMotes));
    this.planetMoteOrbit = planetMoteOrbit;

    keepPlanet(this.makeText(this.planetX - 34, this.planetY + 76, "晨曦星", {
      fontSize: "18px",
      color: "#cfe8ff",
      fontStyle: "bold"
    }));

    this.addSceneAmbientTween({
      targets: planetHalo,
      scale: 1.025,
      alpha: 0.14,
      duration: 4400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    this.addSceneAmbientTween({
      targets: [planetGlow1, planetGlow2],
      scale: 1.018,
      alpha: 0.24,
      duration: 3600,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    this.addSceneAmbientTween({
      targets: planetShieldRing,
      scale: 1.025,
      alpha: 0.3,
      duration: 3900,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    this.addSceneAmbientTween({
      targets: planetWarningGlow,
      alpha: 0.16,
      duration: 2400,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    this.addSceneAmbientTween({
      targets: planetMoteOrbit,
      angle: 360,
      duration: 18000,
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

    const portalGlow = keepPortal(this.add.circle(this.portalX, this.portalY, 86, 0x7e22ce, 0.25));
    const portalOrbit = keepPortal(this.add.ellipse(this.portalX, this.portalY, 138, 108));
    portalOrbit.setStrokeStyle(2, 0xc084fc, 0.24);
    const portalInnerOrbit = keepPortal(this.add.ellipse(this.portalX, this.portalY, 108, 82));
    portalInnerOrbit.setStrokeStyle(1, 0xe879f9, 0.2);
    const portalPulseRing = keepPortal(this.add.circle(this.portalX, this.portalY, 70, 0x7e22ce, 0.01));
    portalPulseRing.setStrokeStyle(3, 0xe879f9, 0.72).setVisible(false).setAlpha(0);
    const portalPulseCore = keepPortal(this.add.circle(this.portalX, this.portalY, 34, 0xf0abfc, 0.18));
    portalPulseCore.setVisible(false).setAlpha(0);
    this.portalGlow = portalGlow;
    this.portalOrbit = portalOrbit;
    this.portalInnerOrbit = portalInnerOrbit;
    this.portalPulseRing = portalPulseRing;
    this.portalPulseCore = portalPulseCore;
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
      this.portalBody = portalBody;
      this.addSceneAmbientTween({
        targets: portalBody,
        angle: -360,
        duration: 12000,
        repeat: -1
      });
    }

    this.addSceneAmbientTween({
      targets: portalOrbit,
      angle: 360,
      duration: 19000,
      repeat: -1
    });

    this.addSceneAmbientTween({
      targets: portalInnerOrbit,
      angle: -360,
      duration: 12500,
      repeat: -1
    });

    this.addSceneAmbientTween({
      targets: portalGlow,
      scale: 1.035,
      alpha: 0.42,
      duration: 3200,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    const portalMoteStarts = [
      { x: -76, y: -32, size: 2.1, delay: 0 },
      { x: 66, y: -44, size: 1.8, delay: 540 },
      { x: 78, y: 28, size: 2.3, delay: 980 },
      { x: -58, y: 52, size: 1.6, delay: 1480 }
    ];
    this.portalMotes = portalMoteStarts.map((config) => (
      this.add.circle(config.x, config.y, config.size, 0xd8b4fe, 0.54)
    ));
    this.portalMoteField = keepPortal(this.add.container(this.portalX, this.portalY, this.portalMotes));
    this.portalMotes.forEach((mote, index) => {
      const config = portalMoteStarts[index];
      this.addSceneAmbientTween({
        targets: mote,
        x: 0,
        y: 0,
        alpha: 0.04,
        scale: 0.35,
        duration: 2500 + config.delay * 0.25,
        delay: config.delay,
        repeat: -1,
        ease: "Sine.easeIn"
      });
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
      0.26
    ));
    fieldBg.setStrokeStyle(1, 0x2563a8, 0.42);

    const fieldInnerFrame = keepField(this.add.rectangle(
      this.startX + (this.cols - 1) * this.cellW / 2,
      this.startY + (this.rows - 1) * this.cellH / 2,
      this.cols * this.cellW + 22,
      this.rows * this.cellH + 22,
      0xffffff,
      0
    ));
    fieldInnerFrame.setStrokeStyle(1, 0x38bdf8, 0.12);

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
          tile.setAlpha(isLogistics ? 0.86 : 0.9);

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
          isLogistics ? 0.18 : 0.13
        ));

        rect.setStrokeStyle(2, stroke, isLogistics ? 0.85 : 0.55);
        rect.setInteractive({ useHandCursor: true });

        const inner = keepField(this.add.rectangle(x, y, this.cellW - 20, this.cellH - 20, 0xffffff, 0));
        inner.setStrokeStyle(1, isLogistics ? 0x67e8f9 : 0x60a5fa, isLogistics ? 0.3 : 0.18);

        const accentLine = keepField(this.add.rectangle(
          x,
          y - this.cellH / 2 + 9,
          this.cellW - 28,
          2,
          isLogistics ? 0x34d399 : 0x38bdf8,
          isLogistics ? 0.52 : 0.3
        ));
        const cornerNode = keepField(this.add.circle(
          x - this.cellW / 2 + 12,
          y - this.cellH / 2 + 10,
          2.2,
          isLogistics ? 0x86efac : 0x7dd3fc,
          isLogistics ? 0.82 : 0.58
        ));

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
          accentLine,
          cornerNode,
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

          if (cell.building) {
            this.queueBuildingSelection(cell.building);
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
          line.setFillStyle(0x67e8f9, 0.45);
          line.setStrokeStyle(2, 0x67e8f9, 0.85);
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

          if (slot.shield) {
            this.queueBuildingSelection(slot.shield);
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
      const imageFrame = this.add.rectangle(x, y + 1, 132, UI_LAYOUT.card.imageHeight - 6, 0xffffff, 0);
      imageFrame.setStrokeStyle(1, accentColor, isMeteorCard ? 0.34 : 0.18);
      imageFrame.setDepth(92);
      const footerBand = this.add.rectangle(x, y + 39, 138, UI_LAYOUT.card.footerHeight, UI_THEME.card.footerFill, 0.98);
      footerBand.setDepth(91);
      const imageGlow = this.add.circle(isMeteorCard ? x - 24 : x, y + 2, isMeteorCard ? 31 : 25, accentColor, 0.1);
      imageGlow.setDepth(91);
      const accent = this.add.rectangle(x, y - 48, 138, 3, accentColor, 0.72);
      accent.setDepth(93);
      const sideRail = this.add.rectangle(x - 68, y + 1, 2, 88, accentColor, isMeteorCard ? 0.62 : 0.32);
      sideRail.setDepth(93);

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
        imageFrame,
        footerBand,
        imageGlow,
        sideRail,
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
    this.statusBarBg.setStrokeStyle(1, UI_THEME.hud.border, 0.46);
    this.statusBarBg.setDepth(90);
    this.statusBarDivider = this.add.rectangle(hudX + 2, hudRows[1], 2, 76, UI_THEME.hud.border, 0.82);
    this.statusBarDivider.setDepth(90);
    this.statusBarTop = this.add.rectangle(hudX + hudWidth / 2, 4, hudWidth - 16, 2, 0xa855f7, 0.34);
    this.statusBarTop.setDepth(90);
    this.hudPanels = hudRows.map((y, index) => {
      const fill = index === 1 ? UI_THEME.hud.panelAlternateFill : UI_THEME.hud.panelFill;
      const panel = this.add.rectangle(
        hudX + hudWidth / 2,
        y,
        hudWidth,
        UI_LAYOUT.hud.rowHeight,
        fill,
        0.52
      );
      panel.setDepth(90);
      return panel;
    });
    this.hudPanelAccents = hudRows.map((y) => {
      const accent = this.add.rectangle(hudX + hudWidth - 3, y, 3, 18, UI_THEME.hud.border, 0.66);
      accent.setDepth(91);
      return accent;
    });
    this.hudPanelSheens = hudRows.map((y, index) => {
      const sheen = this.add.rectangle(
        hudX + hudWidth / 2,
        y - UI_LAYOUT.hud.rowHeight / 2 + 2,
        hudWidth - 12,
        1,
        index === 1 ? 0xa78bfa : 0x7dd3fc,
        0.24
      );
      sheen.setDepth(91);
      return sheen;
    });

    const iconX = hudX + 18;
    const hpIconX = hudX + 125;
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

    this.energyLabel = this.makeHudText(hudX + 36, hudRows[0], "星能", {
      fontSize: UI_THEME.type.hudLabel,
      color: UI_THEME.hud.label,
      fontStyle: "bold"
    });
    this.energyLabel.setOrigin(0, 0.5);
    this.energyLabel.setDepth(91);

    this.waveLabel = this.makeHudText(hudX + 36, hudRows[1], "波次", {
      fontSize: UI_THEME.type.hudLabel,
      color: UI_THEME.hud.label,
      fontStyle: "bold"
    });
    this.waveLabel.setOrigin(0, 0.5);
    this.waveLabel.setDepth(91);

    this.frontlineLabel = this.makeHudText(hudX + 36, hudRows[2], "下一波", {
      fontSize: UI_THEME.type.hudLabel,
      color: UI_THEME.hud.label,
      fontStyle: "bold"
    });
    this.frontlineLabel.setOrigin(0, 0.5);
    this.frontlineLabel.setDepth(91);

    this.energyText = this.makeHudText(hudX + 160, hudRows[0], "", {
      fontSize: "17px",
      color: UI_THEME.hud.energy,
      fontStyle: "bold"
    });
    this.energyText.setOrigin(1, 0.5);
    this.energyText.setDepth(91);

    this.hpText = this.makeHudText(hudX + 208, hudRows[1], "", {
      fontSize: "12px",
      color: UI_THEME.hud.healthy,
      fontStyle: "bold"
    });
    this.hpText.setOrigin(1, 0.5);
    this.hpText.setDepth(91);

    this.waveText = this.makeHudText(hudX + 108, hudRows[1], "", {
      fontSize: "17px",
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
    this.rightHudGlow = this.add.circle(rightHudX, 69, 29, 0x38bdf8, 0.055);
    this.rightHudGlow.setStrokeStyle(1, 0x7dd3fc, 0.16);
    this.rightHudGlow.setDepth(90);
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

    this.frontlineText = this.makeHudText(hudX + 208, hudRows[2], "", {
      fontSize: "13px",
      color: "#dcecff",
      fontStyle: "bold"
    });
    this.frontlineText.setOrigin(1, 0.5);
    this.frontlineText.setDepth(91);

    this.guardTimerText = this.makeHudText(this.W / 2, 18, "守护时间 · 00:00", {
      fontSize: "14px",
      color: "#ccecff",
      fontStyle: "bold"
    });
    this.guardTimerText.setOrigin(0.5, 0.5);
    this.guardTimerText.setAlpha(0.82);
    this.guardTimerText.setDepth(91);

    this.createEnergyCapUpgradeButton();
    this.createSettingsButton();
    this.createEngagementHud();
    this.createBuildingDetailPanel();

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
  }

  createEnergyCapUpgradeButton() {
    const x = UI_LAYOUT.hud.x + UI_LAYOUT.hud.width - 26;
    const y = UI_LAYOUT.hud.rows[0];
    const bg = this.add.rectangle(x, y, 48, 24, UI_THEME.panel.buttonFill, 0.98);
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
      const upgradeCost = this.getEnergyCapUpgradeCost();
      if (upgradeCost !== null && this.starEnergy >= upgradeCost) {
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

    bg.on("pointerdown", () => {
      this.beginFixedUiInteraction();
      this.toggleSettingsMenu();
    });
    this.settingsButton = { bg, icon, label };
  }

  destroySettingsMenu() {
    if (!this.settingsMenuUi) return false;
    this.destroyFixedUi(this.settingsMenuUi);
    this.settingsMenuUi = null;
    return true;
  }

  toggleSettingsMenu() {
    if (this.settingsMenuUi) return this.destroySettingsMenu();
    if (!["ready", "playing"].includes(this.gameState)) return false;

    const elements = [];
    const x = this.W - 108;
    const y = 146;
    const panel = this.add.rectangle(x, y, 190, 116, UI_THEME.panel.fill, 0.96);
    panel.setStrokeStyle(1, UI_THEME.panel.border, 0.62).setDepth(145);
    panel.setInteractive();
    panel.on("pointerdown", () => this.beginFixedUiInteraction());
    elements.push(panel);

    const createMenuRow = (rowY, labelText, handler, enabled = true) => {
      const bg = this.add.rectangle(x, rowY, 162, 42, enabled ? UI_THEME.panel.buttonFill : 0x111827, enabled ? 0.94 : 0.72);
      bg.setStrokeStyle(1, enabled ? UI_THEME.panel.buttonBorder : 0x475569, enabled ? 0.7 : 0.42).setDepth(146);
      const label = this.makeHudText(x, rowY - 1, labelText, {
        fontSize: "15px",
        color: enabled ? UI_THEME.panel.value : "#64748b",
        fontStyle: "bold"
      });
      label.setOrigin(0.5, 0.5).setDepth(147);
      elements.push(bg, label);
      if (enabled) {
        bg.setInteractive({ useHandCursor: true });
        bg.on("pointerdown", () => {
          this.beginFixedUiInteraction();
          handler();
        });
      }
      return bg;
    };

    createMenuRow(y - 25, this.gameState === "playing" ? "暂停游戏" : "尚未开始", () => this.pauseGame(), this.gameState === "playing");
    createMenuRow(y + 25, "重新开始", () => this.showRestartConfirmation());
    this.settingsMenuUi = { elements, panel };
    return true;
  }

  createEngagementHud() {
    const x = this.W - 218;
    const top = 82;
    const width = 230;
    const height = 58;
    const elements = [];
    const panel = this.add.rectangle(0, 0, width, height, UI_THEME.hud.backdropFill, 0.76);
    panel.setStrokeStyle(1, UI_THEME.hud.border, 0.36);
    const accent = this.add.rectangle(-width / 2 + 2, 0, 3, height - 18, 0xa855f7, 0.5);
    const title = this.makeHudText(-width / 2 + 16, -height / 2 + 13, "威胁敌情", {
      fontSize: "14px",
      color: "#dceeff",
      fontStyle: "bold"
    });
    title.setOrigin(0, 0.5);
    elements.push(panel, accent, title);

    const slots = [];
    for (let index = 0; index < ENGAGEMENT_HUD_MAX_SLOTS; index++) {
      const slotY = -43 + index * 29;
      const name = this.makeHudText(-98, slotY, "", {
        fontSize: "12px",
        color: UI_THEME.hud.label,
        fontStyle: "bold"
      });
      name.setOrigin(0, 0.5);
      const barBg = this.add.rectangle(-9, slotY, 96, 5, 0x020617, 0.9);
      barBg.setOrigin(0, 0.5);
      const barFill = this.add.rectangle(-9, slotY, 96, 5, 0xa855f7, 0.95);
      barFill.setOrigin(0, 0.5);
      slots.push({ name, barBg, barFill });
      elements.push(name, barBg, barFill);
    }

    const emptyText = this.makeHudText(0, 12, "暂无威胁", {
      fontSize: "12px",
      color: "#6f8aa4"
    });
    emptyText.setAlpha(0.72);
    emptyText.setOrigin(0.5, 0.5);
    const overflowText = this.makeHudText(0, height / 2 - 14, "", {
      fontSize: "11px",
      color: "#c4b5fd",
      fontStyle: "bold"
    });
    overflowText.setOrigin(0.5, 0.5);
    elements.push(emptyText, overflowText);

    const container = this.add.container(x, top + height / 2, elements);
    container.setVisible(true).setAlpha(1).setDepth(93);
    this.engagementHud = { container, panel, accent, title, slots, emptyText, overflowText, top, width, height, layoutKey: "" };
    this.updateEngagementHud(0, true);
  }

  getEnemyDisplayName(type) {
    return ({
      basic: "普通体",
      fast: "快速体",
      tank: "重装体",
      ranged: "远射体",
      breaker: "破盾体",
      leaper: "跃迁体"
    })[type] || "虚空体";
  }

  getEngagedEnemies() {
    return (this.enemies || [])
      .filter((enemy) => {
        if (!enemy || enemy.dead || !enemy.attackTarget) return false;
        if (enemy.attackTarget.targetType === "planet") return true;
        return this.isEnemyAttackTargetValid(enemy, enemy.attackTarget);
      })
      .slice();
  }

  getEnemyThreatDistance(enemy) {
    if (!enemy || !Number.isFinite(enemy.x) || !Number.isFinite(this.planetX)) return Number.POSITIVE_INFINITY;
    return Math.abs(enemy.x - this.planetX);
  }

  getThreatEnemies() {
    const engagedSet = new Set(this.getEngagedEnemies());

    return (this.enemies || [])
      .filter((enemy) => enemy && !enemy.dead)
      .map((enemy, index) => {
        const attacksPlanet = enemy.attackTarget?.targetType === "planet";
        const isEngaged = engagedSet.has(enemy);
        const priority = attacksPlanet ? 0 : isEngaged ? 1 : THREAT_HUD_SPECIAL_TYPES.has(enemy.type) ? 2 : 3;
        return { enemy, priority, distance: this.getEnemyThreatDistance(enemy), index };
      })
      .sort((left, right) => left.priority - right.priority || left.distance - right.distance || left.index - right.index)
      .map(({ enemy }) => enemy);
  }

  collectHudThreats() {
    // 只保留前四项；不为每只敌人创建排序记录，也不在受击回调里全量排序。
    const visible = this.engagementHud.visibleEnemies || (this.engagementHud.visibleEnemies = []);
    const priorities = this.engagementHud.priorities || (this.engagementHud.priorities = []);
    visible.length = 0;
    priorities.length = 0;
    let count = 0;
    let engagedCount = 0;
    for (const enemy of this.enemies || []) {
      if (!enemy || enemy.dead || (this.frontlineIndex != null && enemy.frontlineId !== this.frontlineIndex)) continue;
      const engaged = enemy.attackTarget && (enemy.attackTarget.targetType === "planet" || this.isEnemyAttackTargetValid(enemy, enemy.attackTarget));
      const priority = enemy.attackTarget?.targetType === "planet" ? 0 : engaged ? 1 : THREAT_HUD_SPECIAL_TYPES.has(enemy.type) ? 2 : 3;
      count++;
      if (engaged) engagedCount++;
      const distance = this.getEnemyThreatDistance(enemy);
      let index = 0;
      while (index < visible.length && (priorities[index] < priority ||
        (priorities[index] === priority && this.getEnemyThreatDistance(visible[index]) <= distance))) index++;
      if (index >= ENGAGEMENT_HUD_MAX_SLOTS) continue;
      visible.splice(index, 0, enemy);
      priorities.splice(index, 0, priority);
      if (visible.length > ENGAGEMENT_HUD_MAX_SLOTS) {
        visible.pop();
        priorities.pop();
      }
    }
    return { visible, count, hiddenHasEngaged: engagedCount > priorities.filter((priority) => priority < 2).length };
  }

  invalidateEngagementHud() {
    // 结构变动合并到下一帧；移动中的排名仍按 0.1 秒刷新。
    this.engagementHudDirty = true;
  }

  updateEngagementHudLayout(visibleCount, hasOverflow) {
    const ui = this.engagementHud;
    if (!ui) return;

    const layoutKey = `${visibleCount}:${hasOverflow ? 1 : 0}`;
    if (ui.layoutKey === layoutKey) return;
    ui.layoutKey = layoutKey;
    const height = visibleCount === 0 ? 58 : 46 + visibleCount * 29 + (hasOverflow ? 20 : 0);
    ui.height = height;
    ui.container.setPosition?.(this.W - 218, ui.top + height / 2);
    ui.panel.setDisplaySize?.(ui.width, height);
    ui.accent.setPosition?.(-ui.width / 2 + 2, 0);
    ui.accent.setDisplaySize?.(3, Math.max(22, height - 18));
    ui.title.setPosition?.(-ui.width / 2 + 16, -height / 2 + 13);
    ui.emptyText.setPosition?.(0, -height / 2 + 40);
    ui.overflowText.setPosition?.(0, height / 2 - 12);

    ui.slots.forEach((slot, index) => {
      const slotY = -height / 2 + 43 + index * 29;
      slot.name.setPosition?.(-98, slotY);
      slot.barBg.setPosition?.(-9, slotY);
      slot.barFill.setPosition?.(-9, slotY);
    });
  }

  updateEngagementHud(dt = 0, force = false) {
    if (!this.engagementHud) return;
    this.engagementHudAccumulator = (this.engagementHudAccumulator || 0) + Math.max(0, dt);
    if (!force && !this.engagementHudDirty && this.engagementHudAccumulator < 0.1) return;
    this.engagementHudAccumulator = 0;
    this.engagementHudDirty = false;

    const { visible, count, hiddenHasEngaged } = this.collectHudThreats();
    const hiddenCount = Math.max(0, count - ENGAGEMENT_HUD_MAX_SLOTS);
    this.updateEngagementHudLayout(visible.length, hiddenCount > 0);
    this.engagementHud.emptyText.setVisible(count === 0);
    this.setTextIfChanged(
      this.engagementHud.overflowText,
      hiddenCount > 0 ? `+${hiddenCount} ${hiddenHasEngaged ? "交战中" : "接近中"}` : ""
    );

    this.engagementHud.slots.forEach((slot, index) => {
      const enemy = visible[index];
      slot.enemy = enemy || null;
      const show = Boolean(enemy);
      slot.name.setVisible(show);
      slot.barBg.setVisible(show);
      slot.barFill.setVisible(show);
      if (!enemy) return;
      const ratio = Phaser.Math.Clamp(enemy.hp / enemy.maxHp, 0, 1);
      this.setTextIfChanged(slot.name, this.getEnemyDisplayName(enemy.type));
      slot.barFill.setScale(ratio, 1);
      slot.barFill.setFillStyle(this.getEnemyEffectColor(enemy.type), 0.95);
    });
  }

  createBuildingSelectionVisual() {
    const field = this.add.circle(0, 0, BUILDING_SELECTION_VISUAL.baseDiameter / 2, 0x38bdf8, 0.085);
    const innerRing = this.add.circle(0, 0, BUILDING_SELECTION_VISUAL.baseDiameter * 0.38, 0x020617, 0.025);
    innerRing.setStrokeStyle(1, 0xe0f7ff, 0.24);
    const outerRing = this.add.circle(0, 0, BUILDING_SELECTION_VISUAL.baseDiameter / 2, 0x020617, 0.01);
    outerRing.setStrokeStyle(2, 0x67e8f9, 0.5);
    const container = this.addToFrontline(this.add.container(0, 0, [field, innerRing, outerRing]));
    container.setDepth?.(64);
    container.setVisible(false).setActive(false).setAlpha(0);
    this.buildingSelectionVisual = { container, field, innerRing, outerRing, target: null, baseScale: 1 };
  }

  getBuildingSelectionDiameter(target) {
    const visual = target?.targetType === "shield" ? target.shieldCore : target?.body;
    const visualSize = Math.max(
      Number(visual?.displayWidth) || 0,
      Number(visual?.displayHeight) || 0,
      target?.targetType === "shield" ? 52 : 48
    );
    const multiplier = target?.targetType === "shield"
      ? BUILDING_SELECTION_VISUAL.shieldScale
      : BUILDING_SELECTION_VISUAL.buildingScale;
    return Phaser.Math.Clamp(
      visualSize * multiplier,
      BUILDING_SELECTION_VISUAL.minDiameter,
      BUILDING_SELECTION_VISUAL.maxDiameter
    );
  }

  positionBuildingSelectionVisual(target) {
    const visual = this.buildingSelectionVisual;
    if (!visual || !target) return false;
    const { x, y } = this.getTargetVisualPosition(target);
    const diameter = this.getBuildingSelectionDiameter(target);
    visual.baseScale = diameter / BUILDING_SELECTION_VISUAL.baseDiameter;
    visual.container.setPosition?.(x, y);
    visual.container.setScale?.(visual.baseScale);
    visual.outerRing.setStrokeStyle?.(target.targetType === "shield" ? 2 : 1, 0x67e8f9, target.targetType === "shield" ? 0.58 : 0.44);
    visual.innerRing.setStrokeStyle?.(1, target.targetType === "shield" ? 0xc4b5fd : 0xe0f7ff, 0.22);
    return true;
  }

  startBuildingSelectionAmbient() {
    const visual = this.buildingSelectionVisual;
    if (!visual?.container?.visible) return null;
    this.stopManagedTween(this.selectionAmbientTween);
    visual.container.setAlpha?.(0.88);
    this.selectionAmbientTween = this.tweens.add({
      targets: visual.container,
      alpha: 0.7,
      duration: 1650,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
    return this.selectionAmbientTween;
  }

  playBuildingSelectionPulse(target) {
    if (!target || target.destroyed || target.wing !== this.activeWing) return;
    const { x, y } = this.getTargetVisualPosition(target);
    const diameter = this.getBuildingSelectionDiameter(target);
    const color = target.targetType === "shield" ? 0xa5b4fc : 0x67e8f9;
    this.playPulseRing(x, y, {
      radius: diameter * 0.38,
      color,
      alpha: 0.82,
      scale: 1.48,
      duration: 210,
      strokeWidth: 2,
      depth: 76,
      priority: "normal"
    });
    this.playRadialSparks(x, y, color, 3, diameter * 0.36, 230, 77, "low");
    if (target.targetType === "building") this.pulseBuildingVisual(target, 1.12, 95);
  }

  showBuildingSelection(target) {
    const visual = this.buildingSelectionVisual;
    if (!visual || !this.isBuildingTargetValid(target)) return false;

    if (visual.target === target && visual.container.visible) {
      this.positionBuildingSelectionVisual(target);
      this.playBuildingSelectionPulse(target);
      return true;
    }

    const serial = ++this.selectionTransitionSerial;
    this.stopManagedTween(this.selectionTransitionTween);
    this.stopManagedTween(this.selectionAmbientTween);
    this.selectionTransitionTween = null;
    this.selectionAmbientTween = null;

    const revealTarget = () => {
      if (serial !== this.selectionTransitionSerial || !this.isBuildingTargetValid(target)) return;
      visual.target = target;
      this.positionBuildingSelectionVisual(target);
      visual.container.setVisible(true).setActive(true).setAlpha(0);
      visual.container.setScale?.(visual.baseScale * 0.96);
      this.playBuildingSelectionPulse(target);
      let revealTween = null;
      revealTween = this.tweens.add({
        targets: visual.container,
        alpha: 0.88,
        scale: visual.baseScale,
        duration: BUILDING_SELECTION_VISUAL.transitionDuration,
        ease: "Sine.easeOut",
        onComplete: () => {
          if (this.selectionTransitionTween === revealTween) this.selectionTransitionTween = null;
          if (serial === this.selectionTransitionSerial) this.startBuildingSelectionAmbient();
        }
      });
      this.selectionTransitionTween = revealTween;
    };

    if (visual.container.visible && visual.target) {
      let fadeTween = null;
      fadeTween = this.tweens.add({
        targets: visual.container,
        alpha: 0,
        duration: 90,
        ease: "Sine.easeIn",
        onComplete: () => {
          if (this.selectionTransitionTween === fadeTween) this.selectionTransitionTween = null;
          revealTarget();
        }
      });
      this.selectionTransitionTween = fadeTween;
    } else {
      revealTarget();
    }
    return true;
  }

  hideBuildingSelection(immediate = false) {
    const visual = this.buildingSelectionVisual;
    if (!visual) return false;
    ++this.selectionTransitionSerial;
    this.stopManagedTween(this.selectionTransitionTween);
    this.stopManagedTween(this.selectionAmbientTween);
    this.selectionTransitionTween = null;
    this.selectionAmbientTween = null;
    visual.target = null;

    const finish = () => {
      visual.container.setVisible(false).setActive(false).setAlpha(0);
      visual.container.setScale?.(1);
    };
    if (immediate || !visual.container.visible || !this.tweens?.add) {
      finish();
      return true;
    }

    let fadeTween = null;
    fadeTween = this.tweens.add({
      targets: visual.container,
      alpha: 0,
      scale: visual.baseScale * 0.96,
      duration: BUILDING_SELECTION_VISUAL.transitionDuration,
      ease: "Sine.easeIn",
      onComplete: () => {
        if (this.selectionTransitionTween === fadeTween) this.selectionTransitionTween = null;
        finish();
      }
    });
    this.selectionTransitionTween = fadeTween;
    return true;
  }

  createBuildingDetailPanel() {
    const x = this.W - 220;
    const y = this.H - 278;
    const width = 310;
    const height = 244;
    const elements = [];
    const panel = this.add.rectangle(0, 0, width, height, UI_THEME.panel.fill, 0.96);
    panel.setStrokeStyle(1, UI_THEME.panel.border, 0.66);
    panel.setInteractive();
    panel.on("pointerdown", () => this.beginFixedUiInteraction());
    const accent = this.add.rectangle(0, -height / 2 + 5, width - 32, 2, 0x67e8f9, 0.82);
    const title = this.makeHudText(-width / 2 + 18, -102, "", {
      fontSize: "18px",
      color: UI_THEME.panel.value,
      fontStyle: "bold"
    });
    title.setOrigin(0, 0.5);
    const levelText = this.makeHudText(width / 2 - 18, -102, "", {
      fontSize: "16px",
      color: UI_THEME.panel.victory,
      fontStyle: "bold"
    });
    levelText.setOrigin(1, 0.5);
    const hpText = this.makeHudText(-width / 2 + 18, -73, "", {
      fontSize: "12px",
      color: UI_THEME.panel.body
    });
    hpText.setOrigin(0, 0.5);
    const hpBarBg = this.add.rectangle(-width / 2 + 18, -55, width - 36, 6, 0x020617, 0.9);
    hpBarBg.setOrigin(0, 0.5);
    const hpBarFill = this.add.rectangle(-width / 2 + 18, -55, width - 36, 6, 0x22c55e, 0.95);
    hpBarFill.setOrigin(0, 0.5);
    const currentText = this.makeHudText(-width / 2 + 18, -30, "", {
      fontSize: "13px",
      color: "#dcecff"
    });
    currentText.setOrigin(0, 0.5);
    const nextText = this.makeHudText(-width / 2 + 18, -5, "", {
      fontSize: "12px",
      color: "#9ed7ef"
    });
    nextText.setOrigin(0, 0.5);
    const costText = this.makeHudText(-width / 2 + 18, 22, "", {
      fontSize: "12px",
      color: UI_THEME.panel.victory,
      fontStyle: "bold"
    });
    costText.setOrigin(0, 0.5);
    elements.push(panel, accent, title, levelText, hpText, hpBarBg, hpBarFill, currentText, nextText, costText);

    const makeActionButton = (buttonX, labelText, handler, danger = false) => {
      const fill = danger ? 0x4b1827 : UI_THEME.panel.buttonFill;
      const border = danger ? 0xfb7185 : UI_THEME.panel.buttonBorder;
      const bg = this.add.rectangle(buttonX, 82, 86, 40, fill, 0.96);
      bg.setStrokeStyle(1, border, 0.78);
      bg.setInteractive({ useHandCursor: true });
      const label = this.makeHudText(buttonX, 81, labelText, {
        fontSize: "13px",
        color: UI_THEME.panel.value,
        fontStyle: "bold"
      });
      label.setOrigin(0.5, 0.5);
      bg.on("pointerdown", () => {
        this.beginFixedUiInteraction();
        handler();
      });
      elements.push(bg, label);
      return { bg, label, baseFill: fill, border };
    };

    const upgradeButton = makeActionButton(-98, "升级", () => this.upgradeSelectedBuilding());
    const repairButton = makeActionButton(0, "维修", () => this.toggleSelectedBuildingRepair());
    const demolishButton = makeActionButton(98, "拆除", () => this.demolishSelectedBuilding(), true);
    const container = this.add.container(x, y, elements);
    container.setDepth(118);
    container.setVisible(false);
    container.setActive(false);
    this.buildingDetailUi = {
      container,
      panel,
      title,
      levelText,
      hpText,
      hpBarFill,
      currentText,
      nextText,
      costText,
      upgradeButton,
      repairButton,
      demolishButton
    };
    this.setBuildingDetailInteractive(false);
  }

  setBuildingDetailInteractive(enabled) {
    if (!this.buildingDetailUi) return;
    if (this.buildingDetailUi.panel?.input) this.buildingDetailUi.panel.input.enabled = enabled;
    for (const button of [
      this.buildingDetailUi.upgradeButton,
      this.buildingDetailUi.repairButton,
      this.buildingDetailUi.demolishButton
    ]) {
      if (button?.bg?.input) button.bg.input.enabled = enabled;
    }
  }

  setDetailButtonState(button, enabled, active = false) {
    if (!button) return;
    if (button.bg?.input) button.bg.input.enabled = enabled;
    button.bg.setAlpha(enabled ? 1 : 0.48);
    button.label.setAlpha(enabled ? 1 : 0.55);
    if (active) button.bg.setFillStyle(0x0e7490, 1);
    else button.bg.setFillStyle(button.baseFill, 0.96);
  }

  getBuildingDisplayName(target) {
    if (target?.targetType === "shield") return "引力护盾";
    return ({ collector: "星尘采集器", turret: "星轨炮台", laser: "光棱卫星" })[target?.id] || "防御建筑";
  }

  getBuildingLevel(target) {
    if (target?.targetType === "shield") return target.shieldLevel;
    if (target?.id === "collector") return target.collectLevel;
    return target?.defenseLevel || 1;
  }

  isBuildingTargetValid(target) {
    if (!target || target.destroyed || target.wing !== this.activeWing || target.frontlineId !== this.frontlineIndex) return false;
    if (target.targetType === "shield") return this.shields.includes(target) && target.slot?.shield === target;
    return this.buildings.includes(target) && target.cell?.building === target;
  }

  getBuildingStatLine(target, level = this.getBuildingLevel(target)) {
    const type = target?.targetType === "shield" ? "shield" : target?.id;
    const stats = this.getBuildingStats(type, level);
    if (!stats) return "";
    if (type === "collector") return `产能 +${stats.amount} / ${this.formatBuildingInterval(stats.interval)}秒`;
    if (type === "shield") return `生命上限 ${stats.maxHp}`;
    return `伤害 ${stats.damage} · 间隔 ${this.formatBuildingInterval(stats.cooldown)}秒 · 射程 ${stats.range}`;
  }

  selectBuildingTarget(target) {
    if (this.gameState !== "playing" || !this.isBuildingTargetValid(target)) return false;
    if (this.selectedBuildingTarget !== target) this.stopBuildingRepair();
    this.clearCardSelection();
    this.clearGridFeedback();
    this.setDemolishMode(false, false);
    this.selectedBuildingTarget = target;
    this.buildingDetailUi.container.setVisible(true).setActive(true);
    this.setBuildingDetailInteractive(true);
    this.updateBuildingDetailPanel(true);
    this.showBuildingSelection(target);
    return true;
  }

  clearBuildingSelection(immediate = false) {
    this.selectedBuildingTarget = null;
    this.stopBuildingRepair();
    this.hideBuildingSelection(immediate);
    if (this.buildingDetailUi) {
      this.buildingDetailUi.container.setVisible(false).setActive(false);
      this.setBuildingDetailInteractive(false);
    }
  }

  updateBuildingDetailPanel(force = false) {
    const target = this.selectedBuildingTarget;
    const ui = this.buildingDetailUi;
    if (!ui || !target) return;
    if (!this.isBuildingTargetValid(target)) {
      this.clearBuildingSelection();
      return;
    }

    const level = this.getBuildingLevel(target);
    const upgradeCost = this.getBuildingUpgradeCost(target.targetType === "shield" ? "shield" : target.id, level);
    const ratio = Phaser.Math.Clamp(target.currentHp / target.maxHp, 0, 1);
    this.setTextIfChanged(ui.title, this.getBuildingDisplayName(target));
    this.setTextIfChanged(ui.levelText, `Lv.${level}`);
    this.setTextIfChanged(ui.hpText, `耐久 ${Math.ceil(target.currentHp)} / ${target.maxHp}`);
    this.setTextIfChanged(ui.currentText, `当前：${this.getBuildingStatLine(target, level)}`);
    this.setTextIfChanged(ui.nextText, `下级：${this.getBuildingStatLine(target, level + 1)}`);
    this.setTextIfChanged(ui.costText, `升级 ${upgradeCost} 星能 · 维修 +${BUILDING_REPAIR_CONFIG.hpPerSecond}HP / -${BUILDING_REPAIR_CONFIG.energyPerSecond}星能每秒`);
    ui.hpBarFill.setScale(ratio, 1);
    ui.hpBarFill.setFillStyle(ratio > 0.5 ? 0x22c55e : ratio > 0.25 ? 0xfacc15 : 0xfb7185, 0.95);
    const canUpgrade = this.gameState === "playing" && this.starEnergy >= upgradeCost;
    const repairing = this.repairTarget === target;
    const canRepair = this.gameState === "playing" && target.currentHp < target.maxHp && (repairing || this.starEnergy >= BUILDING_REPAIR_CONFIG.energyPerSecond);
    this.setTextIfChanged(ui.repairButton.label, repairing ? "修理中" : "修理");
    this.setDetailButtonState(ui.upgradeButton, canUpgrade);
    this.setDetailButtonState(ui.repairButton, canRepair, repairing);
    this.setDetailButtonState(ui.demolishButton, this.gameState === "playing");
  }

  upgradeSelectedBuilding() {
    const target = this.selectedBuildingTarget;
    if (!this.isBuildingTargetValid(target) || this.gameState !== "playing") return false;
    const now = this.time?.now ?? Date.now();
    if (now - (this.lastBuildingUpgradeAt ?? -Infinity) < 140) return false;
    const level = this.getBuildingLevel(target);
    const type = target.targetType === "shield" ? "shield" : target.id;
    const cost = this.getBuildingUpgradeCost(type, level);
    if (this.starEnergy < cost) {
      this.showMessage("星能不足", "warning");
      return false;
    }

    this.lastBuildingUpgradeAt = now;
    this.starEnergy -= cost;
    if (type === "collector") this.applyCollectorLevel(target, level + 1, true);
    else if (type === "shield") this.applyShieldLevel(target, level + 1, false);
    else this.applyDefenseBuildingLevel(target, level + 1, true);
    this.playBuildingUpgradeEffect(target);
    this.showMessage(`${this.getBuildingDisplayName(target)} Lv${level + 1}`, "reward");
    this.updateUI();
    this.updateBuildingDetailPanel(true);
    return true;
  }

  toggleSelectedBuildingRepair() {
    const target = this.selectedBuildingTarget;
    if (this.repairTarget === target) {
      this.stopBuildingRepair();
      return true;
    }
    if (!this.isBuildingTargetValid(target) || this.gameState !== "playing") return false;
    if (target.currentHp >= target.maxHp) {
      this.showMessage("耐久已满", "info");
      return false;
    }
    if (this.starEnergy < BUILDING_REPAIR_CONFIG.energyPerSecond) {
      this.showMessage("星能不足", "warning");
      return false;
    }
    this.repairTarget = target;
    this.repairAccumulator = 0;
    this.updateBuildingDetailPanel(true);
    return true;
  }

  stopBuildingRepair(reason = "") {
    const wasRepairing = Boolean(this.repairTarget);
    this.repairTarget = null;
    this.repairAccumulator = 0;
    if (reason && wasRepairing && this.showMessage) this.showMessage(reason, reason === "星能不足" ? "warning" : "info");
    if (
      this.selectedBuildingTarget &&
      this.buildingDetailUi?.container?.visible &&
      this.isBuildingTargetValid(this.selectedBuildingTarget)
    ) {
      this.updateBuildingDetailPanel(true);
    }
    return wasRepairing;
  }

  updateBuildingRepair(dt) {
    const target = this.repairTarget;
    if (!target) return;
    if (this.gameState !== "playing" || !this.isBuildingTargetValid(target)) {
      this.stopBuildingRepair();
      return;
    }

    this.repairAccumulator += dt;
    while (this.repairAccumulator >= 1 && this.repairTarget === target) {
      if (target.currentHp >= target.maxHp) {
        this.stopBuildingRepair("维修完成");
        break;
      }
      if (this.starEnergy < BUILDING_REPAIR_CONFIG.energyPerSecond) {
        this.stopBuildingRepair("星能不足");
        break;
      }
      this.repairAccumulator -= 1;
      this.starEnergy = Math.max(0, this.starEnergy - BUILDING_REPAIR_CONFIG.energyPerSecond);
      target.currentHp = Math.min(target.maxHp, target.currentHp + BUILDING_REPAIR_CONFIG.hpPerSecond);
      if (target.targetType === "shield") this.updateShieldHealthBar(target);
      else this.updateBuildingHealthBar(target);
      this.updateUI();
      this.updateBuildingDetailPanel(true);
      if (target.currentHp >= target.maxHp) this.stopBuildingRepair("维修完成");
    }
  }

  demolishSelectedBuilding() {
    const target = this.selectedBuildingTarget;
    if (!this.isBuildingTargetValid(target) || this.gameState !== "playing") return false;
    this.clearBuildingSelection();
    return target.targetType === "shield" ? this.demolishShield(target) : this.demolishBuilding(target);
  }

  getEnergyCapUpgradeCost(maxEnergy = this.maxStarEnergy) {
    return ENERGY_CAP_UPGRADE_COSTS[Math.floor(maxEnergy)] ?? null;
  }

  buyEnergyCapUpgrade() {
    if (this.gameState !== "playing") {
      this.showMessage("本局已结束", "warning");
      return false;
    }

    const upgradeCost = this.getEnergyCapUpgradeCost();

    if (this.maxStarEnergy >= ENERGY_CAP_MAX || upgradeCost === null) {
      this.showMessage("星能已满", "warning");
      this.updateEnergyCapUpgradeButtonState();
      return false;
    }

    if (this.starEnergy < upgradeCost) {
      this.showMessage("星能不足", "warning");
      return false;
    }

    this.starEnergy = Math.max(0, this.starEnergy - upgradeCost);
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
    const upgradeCost = this.getEnergyCapUpgradeCost();
    const canAfford = upgradeCost !== null && this.starEnergy >= upgradeCost;
    const stateKey = isFull ? "full" : `${upgradeCost}:${canAfford}`;
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

    bg.setFillStyle(canAfford ? UI_THEME.panel.buttonFill : 0x101827, canAfford ? 0.96 : 0.82);
    bg.setStrokeStyle(1, canAfford ? UI_THEME.panel.buttonBorder : 0x475569, canAfford ? 0.9 : 0.58);
    this.setTextIfChanged(label, upgradeCost);
    label.setColor(canAfford ? UI_THEME.panel.value : "#94a3b8");
    this.energyCapUpgradeButton.icon?.setVisible(true);
    this.energyCapUpgradeButton.icon?.setAlpha(canAfford ? 1 : 0.5);
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
        cell.rect.setFillStyle(isLogistics ? 0x073047 : 0x0b1220, isLogistics ? 0.18 : 0.13);
        cell.inner.setStrokeStyle(1, isLogistics ? 0x67e8f9 : 0x60a5fa, isLogistics ? 0.3 : 0.18);
        cell.accentLine.setFillStyle(isLogistics ? 0x34d399 : 0x38bdf8, isLogistics ? 0.52 : 0.3);
        cell.cornerNode.setFillStyle(isLogistics ? 0x86efac : 0x7dd3fc, isLogistics ? 0.82 : 0.58);

        if (cell.tile) {
          cell.tile.setAlpha(isLogistics ? 0.86 : 0.9);

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
      if (building.wing === this.activeWing) {
        building.ambientParticleTimer = (building.ambientParticleTimer || 0) + dt;
        if (building.ambientParticleTimer >= 1.6) {
          building.ambientParticleTimer %= 1.6;
          this.playCollectorAmbientFlow(building);
        }
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
          this.playCollectorHarvestEffect(building);
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
    this.playBuildingUpgradeEffect(building);
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
    this.playBuildingUpgradeEffect(building);
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
    shield.slot?.line?.setAlpha?.(0.58 + ratio * 0.42);
    if (ratio <= 0.25) shield.slot?.line?.setStrokeStyle?.(2, 0xfb7185, 0.82);
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
    this.playBuildingUpgradeEffect(shield);
    this.showMessage(`引力护盾 Lv${nextLevel}`, "reward");
    this.updateUI();
  }

  addStarEnergy(amount) {
    const previousEnergy = this.starEnergy;
    this.starEnergy = Math.min(this.maxStarEnergy, this.starEnergy + Math.floor(amount));
    if (this.starEnergy !== previousEnergy) this.updateUI();
  }

  floatText(x, y, content, color = "#ffffff") {
    if (!this.canSpawnTransientVisual()) return;
    const t = this.trackTransientVisual(this.makeFrontlineText(x, y, content, {
      fontSize: "18px",
      color,
      fontStyle: "bold"
    }));

    t.setOrigin(0.5);
    t.setDepth(78);

    this.tweens.add({
      targets: t,
      y: y - 35,
      alpha: 0,
      duration: 750,
      onComplete: () => this.destroyTransientVisual(t)
    });
  }

  createMeteorPreview() {
    this.meteorPreviewGlow = this.add.circle(
      0,
      0,
      this.meteorRange - 10,
      0xf97316,
      0.055
    );
    this.meteorPreviewGlow.setVisible(false);
    this.meteorPreviewGlow.setDepth(79);

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
    this.meteorPreviewInner.setStrokeStyle(2, 0xfff1a8, 0.9);
  }

  updateMeteorPreview(pointer) {
    if (this.gameState !== "playing") {
      this.meteorPreviewOuter?.setVisible(false);
      this.meteorPreviewInner?.setVisible(false);
      this.meteorPreviewGlow?.setVisible(false);
      return;
    }

    const shouldShow =
      !this.frontlineTransitioning &&
      !this.demolishMode &&
      this.selectedCard &&
      this.selectedCard.id === "meteor" &&
      !this.isPointerOverFixedUi(pointer);

    if (!shouldShow) {
      this.meteorPreviewOuter.setVisible(false);
      this.meteorPreviewInner.setVisible(false);
      this.meteorPreviewGlow?.setVisible(false);
      return;
    }

    this.meteorPreviewGlow?.setVisible(true);
    this.meteorPreviewOuter.setVisible(true);
    this.meteorPreviewInner.setVisible(true);

    this.meteorPreviewGlow?.setPosition(pointer.x, pointer.y);
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
      card.sideRail?.setFillStyle(accentColor, 0.92);
      card.imageFrame?.setStrokeStyle(2, accentColor, 0.72);
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
      card.sideRail?.setFillStyle(accentColor, 0.64);
      card.imageFrame?.setStrokeStyle(1, accentColor, 0.5);
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
      card.sideRail?.setFillStyle(accentColor, 0.1);
      card.imageFrame?.setStrokeStyle(1, UI_THEME.card.border, 0.16);
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
    card.sideRail?.setFillStyle(accentColor, isMeteorCard ? 0.62 : 0.32);
    card.imageFrame?.setStrokeStyle(1, accentColor, isMeteorCard ? 0.34 : 0.18);
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
    this.clearGridFeedback();
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
      this.clearBuildingSelection();
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
    if (this.gameState !== "playing" || this.frontlineTransitioning || !this.ownsPointer(pointer)) return;

    this.cancelCardDrag();
    this.destroySettingsMenu();
    this.beginFixedUiInteraction();
    this.cardDragState = {
      active: false,
      candidateCard: card,
      card: null,
      startX: pointer?.x ?? 0,
      startY: pointer?.y ?? 0,
      pointerId: pointer?.id,
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
    for (const row of this.gridCells) {
      for (const cell of row) {
        if (Math.abs(pointer.x - (cell.x + this.frontlineLayer.x)) <= this.cellW / 2 &&
            Math.abs(pointer.y - cell.y) <= this.cellH / 2) return cell;
      }
    }
    return null;
  }

  getDragShieldSlot(pointer) {
    return this.shieldSlots.find((slot) => slot.active &&
      Math.abs(pointer.x - (slot.x + this.frontlineLayer.x)) <= 20 &&
      Math.abs(pointer.y - slot.y) <= this.cellH / 2
    ) || null;
  }

  updateCardDragGhost(pointer, releasing = false) {
    if (this.gameState !== "playing" || this.frontlineTransitioning) return;

    const state = this.cardDragState;
    if (!state?.candidateCard || !pointer || (!pointer.isDown && !releasing)) return;
    if (state.pointerId !== undefined && state.pointerId !== pointer.id) return;
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
      const position = card.id === "demolish" ? this.getTargetVisualPosition(target) : target;
      x = position.x + this.frontlineLayer.x;
      y = position.y;
    }
    if (this.isPointerOverFixedUi(pointer)) valid = false;
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
    if (this.gameState !== "playing" || this.frontlineTransitioning) {
      this.cancelCardDrag();
      return false;
    }

    const state = this.cardDragState;
    if (!state?.candidateCard) return false;
    if (state.pointerId !== undefined && state.pointerId !== pointer?.id) return false;
    // 松手位置可能没有触发最后一次 pointermove，必须重新校验落点。
    if (state.active) this.updateCardDragGhost(pointer, true);
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
    else if (card.id === "meteor") this.castMeteor(pointer.x - this.frontlineLayer.x, pointer.y);
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

  ownsPointer(pointer) {
    return this.pointerOwnerId == null || pointer?.id == null || this.pointerOwnerId === pointer.id;
  }

  cancelPointerInteraction() {
    if (this.pointerPressStart || this.cardDragState?.candidateCard) this.clearCardSelection();
    this.cancelPendingMapAction();
    this.cancelCardDrag();
    this.pointerOwnerId = null;
    this.pointerPressStart = null;
    this.pointerDragging = false;
    this.pointerIsTouch = false;
    this.fixedUiPointerActive = false;
    this.clearGridFeedback();
  }

  isPointerOverFixedUi(pointer) {
    if (!pointer || pointer.x < 0 || pointer.x > this.W || pointer.y < 0 || pointer.y >= this.H - 125) return true;
    const panels = [this.statusBarBg, this.rightHudBg, this.engagementHud?.panel,
      this.buildingDetailUi?.panel, this.settingsMenuUi?.panel];
    return panels.some((panel) => panel?.visible && panel.parentContainer?.visible !== false &&
      panel.getBounds?.().contains(pointer.x, pointer.y));
  }

  beginPointerInteraction(pointer) {
    if (this.gameState !== "playing") return;

    if (!pointer || this.pointerPressStart || !this.ownsPointer(pointer)) return;

    this.pointerOwnerId = pointer.id ?? null;
    this.pointerPressStart = { x: pointer.x, y: pointer.y };
    this.pointerDragging = false;
    this.pendingDemolishTarget = null;
    this.pendingPlacementTarget = null;
    this.pendingBuildingSelection = null;
    this.pendingMeteorCast = null;
    this.pointerIsTouch = this.isTouchPointer(pointer);
    this.battlefieldPanStartX = this.frontlineLayer?.x || 0;
  }

  trackPointerMovement(pointer) {
    if (this.gameState !== "playing") return;

    if (!this.pointerPressStart || !pointer?.isDown || !this.ownsPointer(pointer)) return;

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
    return pointer?.wasTouch === true || pointer?.pointerType === "touch" || pointer?.event?.pointerType === "touch";
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

  queueBuildingSelection(target) {
    if (this.gameState !== "playing" || this.demolishMode || this.pointerDragging || this.frontlineTransitioning) return;
    this.pendingBuildingSelection = this.isBuildingTargetValid(target) ? target : null;
  }

  finishPointerInteraction(pointer) {
    if (!this.ownsPointer(pointer)) return;
    // Phaser 3 将 touchcancel 派发为 pointerup，取消不能当作确认部署。
    if (pointer?.wasCanceled === true) {
      this.cancelPointerInteraction();
      return;
    }
    this.pointerOwnerId = null;
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
      this.pointerPressStart = null;
      this.pointerIsTouch = false;
      this.cancelPendingMapAction();
      return;
    }

    const demolishTarget = this.pendingDemolishTarget;
    const placement = this.pendingPlacementTarget;
    const buildingSelection = this.pendingBuildingSelection;
    const meteorCast = this.pendingMeteorCast;
    const isMapTap =
      pointer &&
      !this.isPointerOverFixedUi(pointer) &&
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

    if (isMapTap && buildingSelection) {
      this.destroySettingsMenu();
      this.selectBuildingTarget(buildingSelection);
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
      return;
    }

    if (isMapTap) {
      this.destroySettingsMenu();
      this.clearBuildingSelection();
    }
  }

  cancelPendingDemolish() {
    this.pendingDemolishTarget = null;
  }

  cancelPendingMapAction() {
    this.pendingDemolishTarget = null;
    this.pendingPlacementTarget = null;
    this.pendingBuildingSelection = null;
    this.pendingMeteorCast = null;
  }

  selectCard(cardData) {
    if (this.gameState !== "playing") {
      this.showMessage("本局已结束", "warning");
      return;
    }

    this.setDemolishMode(false, false);
    this.clearBuildingSelection();
    this.destroySettingsMenu();
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
    cell.rect.setFillStyle(isLogistics ? 0x073047 : 0x0b1220, isLogistics ? 0.18 : 0.13);
    cell.accentLine?.setFillStyle(isLogistics ? 0x34d399 : 0x38bdf8, isLogistics ? 0.52 : 0.3);
  }

  clearGridFeedback() {
    for (const row of this.gridCells || []) {
      for (const cell of row || []) this.resetCellStroke(cell);
    }
    for (const slot of this.shieldSlots || []) {
      if (!slot?.active) continue;
      if (slot.placed && slot.shield && !slot.shield.destroyed) {
        const config = this.getBuildingStats("shield", slot.shield.shieldLevel);
        slot.line.setFillStyle(config.color, 0.78);
        slot.line.setStrokeStyle(2, 0xdbeafe, 0.95);
      } else {
        slot.line.setFillStyle(0x60a5fa, 0.13);
        slot.line.setStrokeStyle(1, 0x93c5fd, 0.25);
      }
    }
  }

  setCellFeedback(cell, color, fillAlpha = 0.2) {
    cell.rect.setStrokeStyle(3, color, 1);
    cell.rect.setFillStyle(color, fillAlpha);
    cell.accentLine?.setFillStyle(color, 0.88);
  }

  hoverCell(cell, isHover) {
    if (this.demolishMode) {
      if (cell.occupied && cell.building?.frontlineId === this.frontlineIndex) {
        if (isHover) {
          this.setCellFeedback(cell, 0xfb7185, 0.18);
        } else {
          this.resetCellStroke(cell);
        }
      }

      return;
    }

    if (!this.selectedCard) return;

    if (cell.occupied) {
      if (isHover) this.setCellFeedback(cell, 0x67e8f9, 0.14);
      else this.resetCellStroke(cell);

      return;
    }

    if (this.selectedCard.id === "shield") return;
    if (this.selectedCard.id === "meteor") return;

    if (isHover) {
      const canPlace = this.canPlaceCardOnCell(this.selectedCard, cell, false);
      this.setCellFeedback(cell, canPlace ? 0x22c55e : 0xef4444, 0.2);
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
      this.selectBuildingTarget(cell.building);
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
    buildingGlow.setDepth?.(55);

    const visualConfig = BUILDING_VISUALS[card.id];
    const usesTexture = visualConfig && this.hasTexture(visualConfig.texture);
    const body = usesTexture
      ? this.addToFrontline(this.add.image(cell.x, cell.y, visualConfig.texture).setScale(visualConfig.scale))
      : this.addToFrontline(this.add.rectangle(cell.x, cell.y, 44, 44, color, 0.95));
    if (!usesTexture) body.setStrokeStyle(3, 0x020617, 1);
    body.setDepth?.(60);
    const facingDirection = this.isDirectionalBuildingVisual(card.id)
      ? this.getWingFacingDirection(cell.frontlineId, "building")
      : 0;
    if (facingDirection) {
      this.applyWingFacing(body, cell.frontlineId, "building");
    }

    const core = usesTexture ? null : this.addToFrontline(this.add.circle(cell.x, cell.y, 8, 0xffffff, 0.7));
    core?.setDepth?.(61);

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

    text.setVisible(false).setActive(false);
    healthBarBg.setVisible(false).setActive(false);
    healthBarFill.setVisible(false).setActive(false);
    timerText?.setVisible(false).setActive(false);

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
      ambientParticleTimer: 0,

      attackDamage,
      attackCooldown,
      attackRange,
      attackTimer: 0,
      defenseLevel: 0,
      facingDirection,
      ambientTween: null,
      feedbackTween: null,
      deployTween: null
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
    this.playBuildingDeployEffect(building);

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
      this.selectBuildingTarget(slot.shield);
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
    shieldCore.setDepth?.(60);

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
    shieldText.setVisible(false).setActive(false);
    shieldHpBg.setVisible(false).setActive(false);
    shieldHpFill.setVisible(false).setActive(false);

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
      ambientTween: null,
      deployTween: null
    };

    this.applyShieldLevel(shield, 1, true);

    slot.shield = shield;
    this.shields.push(shield);
    this.registerShieldInWing(shield);
    this.playBuildingDeployEffect(shield, () => {
      if (!shield.destroyed) this.createShieldAmbientTween(shield);
    });

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
    this.playMeteorImpactEffect(x, y);

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
    const restrictedTypes = new Set(["tank", ...(this.enemySpawnConfig.specialRotation || [])]);
    const createsTripleAt = (index, runType) => {
      const firstStart = Math.max(0, index - 2);
      const lastStart = Math.min(index, queue.length - 3);

      for (let start = firstStart; start <= lastStart; start++) {
        if (queue[start] === runType && queue[start + 1] === runType && queue[start + 2] === runType) return true;
      }

      return false;
    };

    // 只接受不会在新位置制造三连的交换，避免大队列中来回交换。
    for (let repairCount = 0; repairCount < queue.length; repairCount++) {
      const runEndIndex = queue.findIndex(
        (candidate, index) => index >= 2 && candidate === type && queue[index - 1] === type && queue[index - 2] === type
      );

      if (runEndIndex === -1) return queue;

      let repaired = false;
      const candidateIndexes = [];
      for (let index = runEndIndex + 1; index < queue.length; index++) candidateIndexes.push(index);
      for (let index = 0; index < runEndIndex - 2; index++) candidateIndexes.push(index);

      for (const swapIndex of candidateIndexes) {
        if (queue[swapIndex] === type) continue;

        const replacementType = queue[swapIndex];
        [queue[runEndIndex], queue[swapIndex]] = [queue[swapIndex], queue[runEndIndex]];
        const keepsCurrentTypeValid = !createsTripleAt(swapIndex, type);
        const keepsReplacementTypeValid = (
          !restrictedTypes.has(replacementType) || !createsTripleAt(runEndIndex, replacementType)
        );
        if (keepsCurrentTypeValid && keepsReplacementTypeValid) {
          repaired = true;
          break;
        }
        [queue[runEndIndex], queue[swapIndex]] = [queue[swapIndex], queue[runEndIndex]];
      }

      if (!repaired) return queue;
    }

    return queue;
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

    this.cancelPointerInteraction();
    this.clearBuildingSelection(true);
    this.destroySettingsMenu();
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
    const facingDirection = this.getWingFacingDirection(frontlineId, role);
    // 敌人素材的原始朝向与建筑素材相反；两类对象分别固定映射，不再按速度动态翻面。
    return role === "enemy" ? facingDirection > 0 : facingDirection < 0;
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
      alpha: shield.usesTexture ? 0.9 : 0.32,
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
    return shield.ambientTween;
  }

  getEnemyEffectColor(type) {
    const colors = {
      basic: 0xfb7185,
      fast: 0xe879f9,
      tank: 0xff7a68,
      ranged: 0xa78bfa,
      breaker: 0xf472b6,
      leaper: 0x8b5cf6
    };
    return colors[type] || VISUAL_EFFECTS.colors.void;
  }

  getEnemySpawnVisualStyle(type) {
    return ({
      basic: { duration: 300, startScale: 0.86, radius: 16, sparks: 1 },
      fast: { duration: 220, startScale: 0.9, radius: 14, sparks: 1 },
      tank: { duration: 380, startScale: 0.8, radius: 22, sparks: 2 },
      ranged: { duration: 330, startScale: 0.86, radius: 18, sparks: 2 },
      breaker: { duration: 350, startScale: 0.84, radius: 20, sparks: 2 },
      leaper: { duration: 300, startScale: 0.84, radius: 18, sparks: 2 }
    })[type] || { duration: 300, startScale: 0.86, radius: 16, sparks: 1 };
  }

  playEnemySpawnMaterializeEffect(enemy) {
    if (!enemy?.container) return null;
    const style = this.getEnemySpawnVisualStyle(enemy.type);
    const color = this.getEnemyEffectColor(enemy.type);
    this.playPulseRing(enemy.x, enemy.y, {
      radius: style.radius,
      color,
      alpha: enemy.type === "tank" || enemy.type === "breaker" ? 0.68 : 0.5,
      scale: enemy.type === "leaper" ? 1.75 : 1.42,
      duration: style.duration,
      depth: 69,
      priority: "low"
    });
    this.playRadialSparks(enemy.x, enemy.y, color, style.sparks, style.radius * 1.5, style.duration, 70, "low");
    if (enemy.type === "leaper") {
      this.playPulseRing(enemy.x, enemy.y, {
        radius: 11,
        color: VISUAL_EFFECTS.colors.voidCore,
        alpha: 0.58,
        scale: 2,
        duration: 240,
        depth: 70,
        priority: "low"
      });
    }

    if (!this.tweens?.add) {
      enemy.container.setAlpha?.(1).setScale?.(1);
      return null;
    }
    let spawnTween = null;
    spawnTween = this.tweens.add({
      targets: enemy.container,
      alpha: { from: 0.08, to: 1 },
      scale: { from: style.startScale, to: 1 },
      duration: style.duration,
      ease: enemy.type === "tank" ? "Cubic.easeOut" : "Sine.easeOut",
      onComplete: () => {
        enemy.container.setAlpha?.(1).setScale?.(1);
        if (enemy.spawnTween === spawnTween) enemy.spawnTween = null;
      }
    });
    enemy.spawnTween = spawnTween;
    return spawnTween;
  }

  updatePlanetVisualState() {
    if (!this.planetShieldRing) return;
    const ratio = Phaser.Math.Clamp(this.planetHp / 100, 0, 1);
    const color = ratio > 0.55
      ? VISUAL_EFFECTS.colors.friendly
      : ratio > 0.25
        ? 0xfacc15
        : VISUAL_EFFECTS.colors.danger;
    this.planetShieldRing.setStrokeStyle?.(ratio > 0.25 ? 2 : 3, color, ratio > 0.25 ? 0.46 : 0.62);
    this.planetShieldInnerRing?.setStrokeStyle?.(1, ratio > 0.25 ? 0xe0f7ff : 0xfda4af, ratio > 0.25 ? 0.2 : 0.34);
    this.planetWarningGlow?.setVisible?.(ratio < 0.3);
  }

  playPlanetHitEffect() {
    const color = this.planetHp > 30 ? VISUAL_EFFECTS.colors.friendlyCore : VISUAL_EFFECTS.colors.danger;
    const impactX = this.planetX - (this.enemyDirection || -1) * 50;
    this.playPulseRing(impactX, this.planetY, {
      radius: 18,
      color,
      alpha: 0.92,
      scale: 2.2,
      duration: 220,
      strokeWidth: 3,
      depth: 79,
      priority: "core"
    });
    this.playPulseRing(this.planetX, this.planetY, {
      radius: 64,
      color,
      alpha: 0.76,
      scale: 1.52,
      duration: 360,
      strokeWidth: 3,
      depth: 78,
      priority: "core"
    });
    const impact = this.addTransientCircle(impactX, this.planetY, 14, color, 0.38, 78, true, "core");
    if (impact) {
      this.tweens.add({
        targets: impact,
        scale: 2.4,
        alpha: 0,
        duration: 220,
        onComplete: () => this.destroyTransientVisual(impact)
      });
    }
    this.playRadialSparks(impactX, this.planetY, color, 5, 34, 300, 80, "core");
    this.cameras?.main?.shake?.(75, 0.0009);
    this.updatePlanetVisualState();
  }

  playPortalSpawnEffect(spawnX, spawnY) {
    const now = this.time?.now ?? Date.now();
    if (now - this.lastPortalSpawnPulseAt < PORTAL_SPAWN_PULSE_COOLDOWN_MS) {
      this.portalPulseRing?.setAlpha?.(Math.max(this.portalPulseRing.alpha || 0, 0.34));
      this.portalPulseCore?.setAlpha?.(Math.max(this.portalPulseCore.alpha || 0, 0.18));
      return false;
    }

    this.lastPortalSpawnPulseAt = now;
    const ring = this.portalPulseRing;
    const core = this.portalPulseCore;
    if (ring && core) {
      this.tweens.killTweensOf?.([ring, core]);
      ring.setVisible(true).setActive(true).setScale(1).setAlpha(0.72);
      core.setVisible(true).setActive(true).setScale(0.92).setAlpha(0.32);
      let ringTween = null;
      ringTween = this.tweens.add({
        targets: ring,
        scale: 1.06,
        alpha: 0,
        duration: 380,
        ease: "Sine.easeOut",
        onComplete: () => {
          ring.setVisible(false).setActive(false).setScale(1);
          if (this.portalSpawnPulseTween === ringTween) this.portalSpawnPulseTween = null;
        }
      });
      let coreTween = null;
      coreTween = this.tweens.add({
        targets: core,
        scale: 1.18,
        alpha: 0,
        duration: 300,
        ease: "Sine.easeOut",
        onComplete: () => {
          core.setVisible(false).setActive(false).setScale(1);
          if (this.portalSpawnCoreTween === coreTween) this.portalSpawnCoreTween = null;
        }
      });
      this.portalSpawnPulseTween = ringTween;
      this.portalSpawnCoreTween = coreTween;
    }

    const sparkCount = this.getBudgetedEffectCount(3, "low");
    const direction = this.enemyDirection || (spawnX >= this.portalX ? 1 : -1);
    for (let index = 0; index < sparkCount; index++) {
      const offsetY = (index - (sparkCount - 1) / 2) * 7;
      const spark = this.addTransientCircle(this.portalX, this.portalY + offsetY, 2, VISUAL_EFFECTS.colors.voidCore, 0.78, 68, true, "low");
      if (!spark) break;
      this.tweens.add({
        targets: spark,
        x: spawnX + direction * (18 + index * 5),
        y: spawnY + offsetY * 0.35,
        scale: 0.4,
        alpha: 0,
        duration: 280,
        ease: "Cubic.easeOut",
        onComplete: () => this.destroyTransientVisual(spark)
      });
    }
    return true;
  }

  getTargetVisualPosition(target) {
    if (target?.targetType === "shield") return { x: target.slot.x, y: target.slot.y };
    return { x: target?.cell?.x ?? 0, y: target?.cell?.y ?? 0 };
  }

  playBuildingDeployEffect(target, onComplete = null) {
    const { x, y } = this.getTargetVisualPosition(target);
    const color = target?.targetType === "shield"
      ? 0xa5d8ff
      : target?.id === "collector"
        ? VISUAL_EFFECTS.colors.resource
        : VISUAL_EFFECTS.colors.friendly;
    this.playPulseRing(x, y, {
      radius: 20,
      color,
      alpha: 0.82,
      scale: 2.05,
      duration: 360,
      depth: 68
    });
    this.playRadialSparks(x, y, color, 4, 28, 300, 69);
    const visual = target?.targetType === "shield" ? target.shieldCore : target?.body;
    if (!visual || !this.tweens?.add) {
      onComplete?.();
      return null;
    }

    const baseScaleX = Number(visual.scaleX) || 1;
    const baseScaleY = Number(visual.scaleY) || baseScaleX;
    const finalAlpha = target.targetType === "shield" && !target.usesTexture ? 0.38 : 1;
    this.tweens.killTweensOf?.(visual);
    let deployTween = null;
    deployTween = this.tweens.add({
      targets: visual,
      alpha: { from: 0.08, to: finalAlpha },
      scaleX: { from: baseScaleX * 0.86, to: baseScaleX },
      scaleY: { from: baseScaleY * 0.86, to: baseScaleY },
      duration: 280,
      ease: "Back.easeOut",
      onComplete: () => {
        if (target.deployTween === deployTween) target.deployTween = null;
        onComplete?.();
      }
    });
    target.deployTween = deployTween;
    return deployTween;
  }

  createBuildingDissolveGhost(target, priority = "normal") {
    if (!target || !this.ensureTransientCapacity(1, priority)) return null;
    const { x, y } = this.getTargetVisualPosition(target);
    const source = target.targetType === "shield" ? target.shieldCore : target.body;
    const configuredVisual = target.targetType === "shield" ? BUILDING_VISUALS.shield : BUILDING_VISUALS[target.id];
    const textureKey = source?.texture?.key || configuredVisual?.texture;
    let ghost = null;
    if (textureKey && this.hasTexture(textureKey)) {
      ghost = this.add.image(x, y, textureKey);
      ghost.setScale?.(Number(source?.scaleX) || configuredVisual?.scale || 1, Number(source?.scaleY) || Number(source?.scaleX) || configuredVisual?.scale || 1);
      ghost.setFlipX?.(Boolean(source?.flipX));
    } else {
      const width = Math.max(12, Number(source?.displayWidth) || (target.targetType === "shield" ? 14 : 44));
      const height = Math.max(18, Number(source?.displayHeight) || (target.targetType === "shield" ? (Number(this.cellH) || 70) - 12 : 44));
      ghost = this.add.rectangle(x, y, width, height, target.targetType === "shield" ? 0x93c5fd : 0x38bdf8, 0.72);
      ghost.setStrokeStyle?.(2, 0xe0f7ff, 0.58);
    }
    const visual = this.addToFrontline(ghost);
    visual.setDepth?.(75);
    return this.trackTransientVisual(visual, priority);
  }

  playBuildingDisassembleEffect(target, cause = "destroyed") {
    if (!target) return null;
    const { x, y } = this.getTargetVisualPosition(target);
    const isShield = target.targetType === "shield";
    const isDemolish = cause === "demolish";
    const color = isDemolish ? 0x67e8f9 : isShield ? 0xa78bfa : 0xfb7185;
    const priority = !isDemolish && isShield ? "core" : "normal";
    const duration = isDemolish ? 430 : isShield ? 560 : 490;
    const ghost = this.createBuildingDissolveGhost(target, priority);

    this.playPulseRing(x, y, {
      radius: isShield ? 26 : 22,
      color,
      alpha: isDemolish ? 0.72 : 0.88,
      scale: isDemolish ? 1.45 : isShield ? 2.15 : 1.8,
      duration,
      strokeWidth: isShield ? 3 : 2,
      depth: 76,
      priority
    });
    if (!isDemolish && isShield) {
      this.playPulseRing(x, y, {
        radius: 36,
        color: 0xe0e7ff,
        alpha: 0.62,
        scale: 1.9,
        duration: 480,
        strokeWidth: 2,
        depth: 77,
        priority: "core"
      });
    }
    this.playRadialSparks(
      x,
      y,
      color,
      isDemolish ? 4 : isShield ? 8 : 6,
      isDemolish ? 30 : isShield ? 52 : 42,
      duration,
      78,
      priority
    );

    if (!ghost || !this.tweens?.add) return ghost;
    const baseScaleX = Number(ghost.scaleX) || 1;
    const baseScaleY = Number(ghost.scaleY) || baseScaleX;
    ghost.setTintFill?.(isDemolish ? 0xcffafe : isShield ? 0xe9d5ff : 0xffb4c2);
    this.tweens.add({
      targets: ghost,
      alpha: 0,
      scaleX: baseScaleX * (isDemolish ? 0.78 : 0.68),
      scaleY: baseScaleY * (isDemolish ? 0.78 : 0.82),
      angle: isDemolish ? 0 : target.targetType === "shield" ? 4 : 7,
      duration,
      ease: isDemolish ? "Sine.easeIn" : "Cubic.easeIn",
      onComplete: () => this.destroyTransientVisual(ghost)
    });
    return ghost;
  }

  playBuildingUpgradeEffect(target) {
    const { x, y } = this.getTargetVisualPosition(target);
    const color = target?.targetType === "shield"
      ? 0xfacc15
      : target?.id === "collector"
        ? 0x86efac
        : target?.id === "laser"
          ? 0xffd166
          : 0x67e8f9;
    this.playPulseRing(x, y, {
      radius: 23,
      color,
      alpha: 0.9,
      scale: 1.85,
      duration: 420,
      strokeWidth: 3,
      depth: 77
    });
    this.playRadialSparks(x, y, color, 5, 38, 380, 78);
  }

  playCollectorHarvestEffect(building) {
    if (!building || building.wing !== this.activeWing) return;
    this.playPulseRing(building.cell.x, building.cell.y, {
      radius: 15,
      color: VISUAL_EFFECTS.colors.resource,
      alpha: 0.7,
      scale: 1.75,
      duration: 260,
      depth: 67
    });
    this.playRadialSparks(building.cell.x, building.cell.y - 6, 0x86efac, 3, 24, 300, 68, "low");
  }

  playCollectorAmbientFlow(building) {
    if (!building || building.destroyed || building.wing !== this.activeWing || !this.canSpawnTransientVisual()) return;
    const mote = this.addTransientCircle(building.cell.x - 8, building.cell.y + 12, 2.2, 0x86efac, 0.78, 67);
    if (!mote) return;
    this.tweens.add({
      targets: mote,
      x: building.cell.x + 7,
      y: building.cell.y - 20,
      alpha: 0,
      scale: 0.45,
      duration: 720,
      ease: "Sine.easeInOut",
      onComplete: () => this.destroyTransientVisual(mote)
    });
  }

  playBuildingHitEffect(building) {
    if (!building || building.wing !== this.activeWing) return;
    this.playPulseRing(building.cell.x, building.cell.y, {
      radius: 18,
      color: VISUAL_EFFECTS.colors.danger,
      alpha: 0.68,
      scale: 1.5,
      duration: 190,
      depth: 76
    });
  }

  playShieldHitEffect(shield, isBreaker = false) {
    if (!shield || shield.wing !== this.activeWing) return;
    const color = isBreaker ? 0xf472b6 : 0x7dd3fc;
    this.playPulseRing(shield.slot.x, shield.slot.y, {
      radius: isBreaker ? 22 : 17,
      color,
      alpha: isBreaker ? 0.9 : 0.68,
      scale: isBreaker ? 1.75 : 1.5,
      duration: isBreaker ? 260 : 190,
      strokeWidth: isBreaker ? 3 : 2,
      depth: 77,
      priority: isBreaker ? "core" : "normal"
    });
    this.playRadialSparks(shield.slot.x, shield.slot.y, color, isBreaker ? 4 : 2, isBreaker ? 34 : 20, 280, 78, isBreaker ? "core" : "low");
  }

  playMuzzleFlash(building, color = VISUAL_EFFECTS.colors.friendlyCore) {
    const x = this.getBuildingMuzzleX(building);
    const y = building.cell.y;
    const flash = this.addTransientCircle(x, y, 6, color, 0.92, 72);
    if (!flash) return;
    this.tweens.add({
      targets: flash,
      scale: 2.1,
      alpha: 0,
      duration: 110,
      onComplete: () => this.destroyTransientVisual(flash)
    });
    this.playRadialSparks(x, y, color, 2, 15, 150, 72, "low");
  }

  playLaserChargeEffect(building, color = 0xfff1a8) {
    const x = this.getBuildingMuzzleX(building);
    const charge = this.addTransientCircle(x, building.cell.y, 4, color, 0.78, 71);
    if (!charge) return;
    this.tweens.add({
      targets: charge,
      scale: 2.5,
      alpha: 0,
      duration: 105,
      ease: "Sine.easeOut",
      onComplete: () => this.destroyTransientVisual(charge)
    });
  }

  playEnemyHitEffect(enemy) {
    if (!enemy || enemy.dead) return;
    this.playPulseRing(enemy.x, enemy.y, {
      radius: enemy.type === "tank" ? 16 : 12,
      color: this.getEnemyEffectColor(enemy.type),
      alpha: 0.6,
      scale: 1.45,
      duration: 140,
      depth: 74
    });
  }

  playEnemyDeathEffect(enemy) {
    if (!enemy) return;
    const color = this.getEnemyEffectColor(enemy.type);
    const deathStyle = {
      basic: { duration: 360, shrink: 0.68, sparks: 5, distance: 36, angle: 10 },
      fast: { duration: 280, shrink: 0.5, sparks: 4, distance: 46, angle: 14 },
      tank: { duration: 560, shrink: 0.88, sparks: 7, distance: 48, angle: 4 },
      ranged: { duration: 440, shrink: 0.62, sparks: 6, distance: 42, angle: 9 },
      breaker: { duration: 480, shrink: 0.72, sparks: 6, distance: 45, angle: 8 },
      leaper: { duration: 400, shrink: 0.38, sparks: 5, distance: 38, angle: 12 }
    }[enemy.type] || { duration: 360, shrink: 0.68, sparks: 5, distance: 36, angle: 10 };
    const isTank = enemy.type === "tank";
    const isSpecial = ["ranged", "breaker", "leaper"].includes(enemy.type);
    const duration = deathStyle.duration;
    // 实体消散与碎光共用预算，群体死亡不能绕过 112 个临时对象上限。
    const container = enemy.container;
    if (!container?.active || !this.tweens?.add || !this.ensureTransientCapacity(1, "normal")) {
      container?.destroy?.();
      return;
    }
    this.trackTransientVisual(container);
    this.enemyDeathVisuals ??= new Set();
    this.enemyDeathVisuals.add(container);
    this.playPulseRing(enemy.x, enemy.y, {
      radius: isTank ? 22 : 17,
      color,
      alpha: isTank || isSpecial ? 0.62 : 0.42,
      scale: isTank ? 2.1 : 1.85,
      duration: Math.min(duration, 420),
      strokeWidth: isTank ? 3 : 2,
      depth: 74,
      priority: "normal"
    });
    this.playRadialSparks(enemy.x, enemy.y, color, deathStyle.sparks, deathStyle.distance, duration, 75, "normal");
    if (enemy.type === "breaker") {
      this.playPulseRing(enemy.x, enemy.y, { radius: 12, color: 0xf472b6, scale: 2.4, duration: 240, depth: 75, priority: "normal" });
    }

    // 出生途中被击败时，从当前透明度渐出，不跳回完全不透明。
    container.setAngle?.(0);
    enemy.body?.setTintFill?.(isTank ? 0xffb4a8 : 0xe9d5ff);
    this.tweens.add({
      targets: container,
      alpha: 0,
      scale: deathStyle.shrink,
      angle: (enemy.direction || 1) * deathStyle.angle,
      duration,
      ease: "Cubic.easeIn",
      onComplete: () => {
        this.destroyTransientVisual(container);
      }
    });
  }

  playLeaperJumpEffect(enemy, fromX, landingX) {
    const color = this.getEnemyEffectColor("leaper");
    this.playPulseRing(fromX, enemy.y, {
      radius: 15,
      color,
      alpha: 0.72,
      scale: 1.7,
      duration: 220,
      depth: 69
    });
    this.playPulseRing(landingX, enemy.y, {
      radius: 13,
      color: VISUAL_EFFECTS.colors.voidCore,
      alpha: 0.8,
      scale: 1.8,
      duration: 240,
      depth: 69
    });

    if (!this.add?.graphics || !this.canSpawnTransientVisual()) return;
    const trail = this.trackTransientVisual(this.addToFrontline(this.add.graphics()));
    trail.setDepth?.(68);
    trail.lineStyle(6, color, 0.14);
    trail.beginPath();
    trail.moveTo(fromX, enemy.y);
    trail.lineTo(landingX, enemy.y);
    trail.strokePath();
    trail.lineStyle(2, VISUAL_EFFECTS.colors.voidCore, 0.5);
    trail.beginPath();
    trail.moveTo(fromX, enemy.y);
    trail.lineTo(landingX, enemy.y);
    trail.strokePath();
    this.tweens.add({
      targets: trail,
      alpha: 0,
      duration: 180,
      onComplete: () => this.destroyTransientVisual(trail)
    });
  }

  playMeteorImpactEffect(x, y) {
    const meteorColor = VISUAL_EFFECTS.colors.meteor;
    const coreColor = VISUAL_EFFECTS.colors.meteorCore;

    if (this.add?.graphics && this.canSpawnTransientVisual(3)) {
      const startX = x + 74;
      const startY = y - 156;
      const streak = this.trackTransientVisual(this.addToFrontline(this.add.graphics()));
      streak.setDepth?.(78);
      streak.lineStyle(14, 0xf97316, 0.1);
      streak.beginPath();
      streak.moveTo(startX, startY);
      streak.lineTo(x, y);
      streak.strokePath();
      streak.lineStyle(4, coreColor, 0.78);
      streak.beginPath();
      streak.moveTo(startX, startY);
      streak.lineTo(x, y);
      streak.strokePath();

      const meteorGlow = this.addTransientCircle(startX, startY, 16, meteorColor, 0.24, 79);
      const meteorCore = this.addTransientCircle(startX, startY, 6, coreColor, 0.98, 80);
      this.tweens.add({
        targets: streak,
        alpha: 0,
        duration: 250,
        onComplete: () => this.destroyTransientVisual(streak)
      });
      if (meteorGlow && meteorCore) {
        this.tweens.add({
          targets: [meteorGlow, meteorCore],
          x,
          y,
          alpha: 0,
          duration: 170,
          ease: "Cubic.easeIn",
          onComplete: () => {
            this.destroyTransientVisual(meteorGlow);
            this.destroyTransientVisual(meteorCore);
          }
        });
      }
    }

    this.playPulseRing(x, y, {
      radius: 28,
      color: coreColor,
      alpha: 0.94,
      scale: 4.4,
      duration: 430,
      strokeWidth: 4,
      depth: 80,
      priority: "core"
    });
    this.playPulseRing(x, y, {
      radius: 58,
      color: meteorColor,
      alpha: 0.72,
      scale: 2.15,
      duration: 540,
      strokeWidth: 3,
      depth: 79,
      priority: "core"
    });

    const flare = this.addTransientCircle(x, y, 34, coreColor, 0.42, 79);
    if (flare) {
      this.tweens.add({
        targets: flare,
        scale: 2.5,
        alpha: 0,
        duration: 360,
        onComplete: () => this.destroyTransientVisual(flare)
      });
    }

    const afterglow = this.addTransientCircle(x, y, 54, 0xf97316, 0.13, 66);
    if (afterglow) {
      this.tweens.add({
        targets: afterglow,
        scale: 1.22,
        alpha: 0,
        delay: 240,
        duration: 760,
        onComplete: () => this.destroyTransientVisual(afterglow)
      });
    }

    this.playRadialSparks(x, y, meteorColor, 10, 104, 520, 81, "core");
    this.cameras?.main?.shake?.(110, 0.0022);
  }

  syncWingAnimationState() {
    for (const building of this.buildings || []) {
      const shouldPause = building.destroyed || building.wing !== this.activeWing;
      this.setManagedTweenPaused(building.ambientTween, shouldPause);
      this.setManagedTweenPaused(building.feedbackTween, shouldPause);
      this.setManagedTweenPaused(building.deployTween, shouldPause);
    }

    for (const shield of this.shields || []) {
      const shouldPause = shield.destroyed || shield.wing !== this.activeWing;
      this.setManagedTweenPaused(shield.ambientTween, shouldPause);
      this.setManagedTweenPaused(shield.deployTween, shouldPause);
    }
  }

  setBuildingWingVisibility(building, visible) {
    if (!building) return;

    for (const object of [building.glow, building.body, building.core]) {
      this.setWingObjectVisible(object, visible);
    }
    for (const object of [building.text, building.healthBarBg, building.healthBarFill, building.timerText]) {
      this.setWingObjectVisible(object, false);
    }

    this.setManagedTweenPaused(building.ambientTween, !visible);
    this.setManagedTweenPaused(building.feedbackTween, !visible);
    this.setManagedTweenPaused(building.deployTween, !visible);

    if (visible && this.isDirectionalBuildingVisual(building.id)) {
      this.applyWingFacing(building.body, building.frontlineId, "building");
    }
  }

  setShieldWingVisibility(shield, visible) {
    if (!shield) return;

    this.setWingObjectVisible(shield.shieldCore, visible);
    for (const object of [shield.healthBarBg, shield.healthBarFill, shield.text]) this.setWingObjectVisible(object, false);
    this.setManagedTweenPaused(shield.ambientTween, !visible);
    this.setManagedTweenPaused(shield.deployTween, !visible);
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

    this.destroyBuilding(building, "demolish");

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

    this.removeShield(shield, "demolish");

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
    if (this.selectedBuildingTarget === building) this.updateBuildingDetailPanel(true);
    this.playBuildingHitEffect(building);

    if (building.currentHp <= 0) {
      this.destroyBuilding(building);
      this.showMessage("建筑被摧毁", "danger");
    }
  }

  destroyBuilding(building, cause = "destroyed") {
    if (!building || building.destroyed) return;

    if (this.selectedBuildingTarget === building || this.repairTarget === building) this.clearBuildingSelection();
    this.playBuildingDisassembleEffect(building, cause);
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
    this.stopManagedTween(building.deployTween);
    building.ambientTween = null;
    building.feedbackTween = null;
    building.deployTween = null;
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
    const motionTrail = isFast ? this.add.ellipse(-facingDirection * 12, 0, 38, 13, 0xe879f9, 0.12) : null;
    const armorRing = isTank ? this.add.circle(0, 0, 25, 0x000000, 0) : null;
    armorRing?.setStrokeStyle?.(2, 0xff8a7a, 0.36);
    const rangedCore = isRanged ? this.add.circle(facingDirection * 7, 0, 5, 0xd8b4fe, 0.48) : null;
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

    const children = [motionTrail, aura, armorRing, body, rangedCore, core].filter(Boolean);
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
      aura,
      motionTrail,
      armorRing,
      rangedCore,
      spawnTween: null,
      dead: false
    };

    this.applyEnemyWingFacing(enemy);
    this.enemies.push(enemy);
    this.invalidateEngagementHud();
    this.playEnemySpawnMaterializeEffect(enemy);
    this.playPortalSpawnEffect(x, y);
  }

  updateEnemyAttacks(dt) {
    if (this.gameState !== "playing") return;

    for (const enemy of this.enemies) {
      if (enemy.dead || !enemy.attackTarget) continue;

      // 新部署的前排设施也必须挡住远射，不能继续穿过它攻击旧目标。
      if (enemy.type === "ranged" && this.findRangedTarget(enemy) !== enemy.attackTarget) {
        this.clearEnemyTarget(enemy);
        continue;
      }

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
          this.damageShield(target, attackDamage, enemy.type === "breaker");

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
    let closest = null;
    let closestOrder = Infinity;
    // 每只移动敌人每帧调用，直接选最前方接触点，保留同距时建筑优先的顺序。
    for (let group = 0; group < 2; group++) {
      const targets = group === 0 ? this.buildings : this.shields;
      for (const target of targets) {
        const position = group === 0 ? target.cell : target.slot;
        if (target.destroyed || target.frontlineId !== enemy.frontlineId || position.row !== enemy.row) continue;
        const contactX = this.getBlockingContactX(enemy, target);
        const order = contactX * enemy.direction;
        if (order >= closestOrder || !this.hasEnemyReachedContact(enemy, contactX)) continue;
        closest = target;
        closestOrder = order;
      }
    }
    return closest;
  }

  findRangedTarget(enemy) {
    let closest = null;
    let closestDistance = Infinity;
    for (let group = 0; group < 2; group++) {
      const targets = group === 0 ? this.buildings : this.shields;
      for (const target of targets) {
        const distance = (this.getEnemyTargetX(target) - enemy.x) * enemy.direction;
        if (distance < 0 || distance > enemy.attackRange || distance >= closestDistance) continue;
        if (!this.isValidEnemyTarget(enemy, target)) continue;
        closest = target;
        closestDistance = distance;
      }
    }
    return closest;
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
    this.invalidateEngagementHud();
  }

  tryLeaperJump(enemy, target) {
    if (enemy.hasLeaped || enemy.leapAttempted || !this.isValidEnemyTarget(enemy, target)) return false;

    enemy.leapAttempted = true;

    const landingX = this.getLeaperLandingX(enemy, target);

    if (!this.isValidLeaperLanding(enemy, target, landingX)) return false;

    const fromX = enemy.x;
    enemy.hasLeaped = true;
    enemy.isLeaping = true;
    this.clearEnemyTarget(enemy);
    enemy.x = landingX;
    enemy.lastX = landingX;
    enemy.container.x = landingX;
    this.playLeaperJumpEffect(enemy, fromX, landingX);

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
    this.invalidateEngagementHud();
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
    this.invalidateEngagementHud();
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
    this.playPlanetHitEffect();
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
    const trail = this.addTransientCircle(muzzleX, building.cell.y, 10, 0x38bdf8, 0.16, 68);

    this.projectiles.push({
      sprite: bullet,
      trail,
      target,
      damage: building.attackDamage,
      speed: 520,
      life: 1.6
    });

    this.playMuzzleFlash(building, VISUAL_EFFECTS.colors.friendlyCore);
    this.pulseBuildingVisual(building, 1.3, 80);
  }

  fireLaserBeam(building, target) {
    const color = building.id === "laser" ? 0xfacc15 : 0x38bdf8;
    const width = building.id === "laser" ? 4 : 2;
    const muzzleX = this.getBuildingMuzzleX(building);
    const targetX = target.x + target.direction * target.radius;
    if (building.id === "laser") this.playLaserChargeEffect(building);

    if (this.canSpawnTransientVisual()) {
      const shot = this.trackTransientVisual(this.addToFrontline(this.add.graphics()));
      shot.setDepth(68);
      shot.lineStyle(width + 6, color, 0.16);
      shot.beginPath();
      shot.moveTo(muzzleX, building.cell.y);
      shot.lineTo(targetX, target.y);
      shot.strokePath();
      shot.lineStyle(width, building.id === "laser" ? 0xfff7d6 : 0xe0f7ff, 0.96);
      shot.beginPath();
      shot.moveTo(muzzleX, building.cell.y);
      shot.lineTo(targetX, target.y);
      shot.strokePath();

      this.tweens.add({
        targets: shot,
        alpha: 0,
        duration: 150,
        onComplete: () => this.destroyTransientVisual(shot)
      });
    }

    this.playMuzzleFlash(building, building.id === "laser" ? 0xfff1a8 : VISUAL_EFFECTS.colors.friendlyCore);
    this.pulseBuildingVisual(building, 1.3, 80);

    this.damageEnemy(target, building.attackDamage);
    this.playRadialSparks(targetX, target.y, color, 3, 20, 190, 73, "low");
  }

  getBuildingMuzzleX(building) {
    return building.cell.x + this.getBuildingFacingDirection(building) * 18;
  }

  fireRangedShot(enemy, target) {
    const targetX = this.getEnemyTargetX(target);
    const targetY = target.targetType === "shield" ? target.slot.y : target.cell.y;
    if (!this.canSpawnTransientVisual()) return;
    const shot = this.trackTransientVisual(this.addToFrontline(this.add.graphics()));

    shot.setDepth(68);
    shot.lineStyle(6, 0x7c3aed, 0.15);
    shot.beginPath();
    shot.moveTo(enemy.x - enemy.direction * enemy.radius, enemy.y);
    shot.lineTo(targetX, targetY);
    shot.strokePath();
    shot.lineStyle(2, 0xd8b4fe, 0.92);
    shot.beginPath();
    shot.moveTo(enemy.x - enemy.direction * enemy.radius, enemy.y);
    shot.lineTo(targetX, targetY);
    shot.strokePath();

    this.tweens.add({
      targets: shot,
      alpha: 0,
      duration: 160,
      onComplete: () => this.destroyTransientVisual(shot)
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
      const moveX = (dx / dist) * step;
      const moveY = (dy / dist) * step;

      projectile.sprite.x += moveX;
      projectile.sprite.y += moveY;
      projectile.trail?.setPosition?.(
        projectile.sprite.x - (dx / dist) * 8,
        projectile.sprite.y - (dy / dist) * 8
      );
    }
  }

  removeProjectile(projectile, index = this.projectiles.indexOf(projectile)) {
    projectile.sprite.destroy();
    this.destroyTransientVisual(projectile.trail);

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
    } else {
      this.playEnemyHitEffect(enemy);
    }
  }

  updateEnemyHealthBar(enemy) {
    if (!enemy || enemy.dead) return;
    for (const slot of this.engagementHud?.slots || []) {
      if (slot.enemy === enemy) slot.barFill.setScale(Phaser.Math.Clamp(enemy.hp / enemy.maxHp, 0, 1), 1);
    }
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
    enemy.spawnTween = null;
    this.invalidateEngagementHud();

    if (giveReward) this.playEnemyDeathEffect(enemy);
    else enemy.container.destroy();

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

  damageShield(shield, amount, isBreaker = false) {
    if (!shield || shield.destroyed || shield.wing !== this.activeWing) return;

    shield.currentHp = Math.max(0, shield.currentHp - amount);
    this.updateShieldHealthBar(shield);
    if (this.selectedBuildingTarget === shield) this.updateBuildingDetailPanel(true);
    this.playShieldHitEffect(shield, isBreaker);

    if (shield.currentHp <= 0) {
      this.removeShield(shield);
      this.showMessage("护盾被击穿", "danger");
    }
  }

  removeShield(shield, cause = "destroyed") {
    if (!shield || shield.destroyed) return;

    if (this.selectedBuildingTarget === shield || this.repairTarget === shield) this.clearBuildingSelection();
    this.playBuildingDisassembleEffect(shield, cause);
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
    this.stopManagedTween(shield.deployTween);
    shield.ambientTween = null;
    shield.deployTween = null;
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
    if (this.gameState === "ready") return "等待启航";
    if (this.gameState === "paused") return "已暂停";
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

  formatGuardTime(totalSeconds = this.guardElapsedSeconds) {
    const seconds = Math.max(0, Math.floor(totalSeconds || 0));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainSeconds = seconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainSeconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(remainSeconds).padStart(2, "0")}`;
  }

  updateGuardTimer(dt = 0, force = false) {
    if (this.gameState === "playing" && dt > 0) this.guardElapsedSeconds += dt;
    const display = `守护时间 · ${this.formatGuardTime()}`;
    if (force || display !== this.guardTimerDisplay) {
      this.guardTimerDisplay = display;
      this.setTextIfChanged(this.guardTimerText, display);
    }
  }

  handleGlobalClick(pointer) {
    if (this.gameState !== "playing") return;

    if (this.fixedUiPointerActive) return;

    if (!this.ownsPointer(pointer) || this.isPointerOverFixedUi(pointer)) return;

    if (this.frontlineTransitioning) return;

    if (this.pointerDragging || this.demolishMode) return;

    if (!this.selectedCard) return;

    if (this.selectedCard.id === "meteor") {
      this.pendingMeteorCast = { x: pointer.x - this.frontlineLayer.x, y: pointer.y };
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
    this.messageText.setShadow?.(0, 0, style.color, type === "reward" ? 10 : 7, true, true);
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
    this.updateGuardTimer(0, force);
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
    this.updateBuildingDetailPanel(force);
  }
}

// 星港只管理局外画面；不继承战斗 update，不创建隐藏战场或第二个 Phaser Game。
const TERMINAL_STYLE = {
  left: 88, buttonWidth: 360, primaryY: 430, secondaryRows: [536, 638],
  cyan: 0x69dcff, ink: 0x081527, muted: "#a9bfd7", text: "#e5f3ff",
  exitDuration: 320, maxAmbientTweens: 6
};

// 战斗与档案共用原始配置，每次返回独立对象，档案不改写局内状态。
function createBuildingProgressionConfig() {
  return {
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
}

// 战斗与档案共用原始配置，每次返回独立对象，档案不改写局内状态。
function createEnemySpawnConfig() {
  return {
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
}

const ARCHIVE_CATEGORIES = [
  { id: "dawnstar", number: "01", name: "晨曦星", english: "DAWNSTAR" },
  { id: "rift", number: "02", name: "虚空裂隙", english: "VOID RIFT" },
  { id: "defense", number: "03", name: "防御设施", english: "DEFENSE SYSTEMS" },
  { id: "hostile", number: "04", name: "敌军单位", english: "HOSTILE UNITS" }
];

// 这里只登记档案文案和视觉引用；所有战术数值在查询时读取战斗配置。
const ARCHIVE_ENTRIES = [
  { id: "DST-001", category: "dawnstar", name: "晨曦星", english: "DAWNSTAR", role: "CORE WORLD", status: "PROTECTED", texture: "home_planet_dawnstar", description: "当前防线的核心保护目标。\n两翼防御共同守护晨曦星。" },
  { id: "VRT-001", category: "rift", name: "虚空裂隙", english: "VOID RIFT", role: "SPATIAL ANOMALY", status: "ACTIVE", texture: "void_portal", description: "敌军进入战场的异常入口。\n虚空潮汐从这里逼近防线。" },
  { id: "DEF-001", category: "defense", type: "collector", name: "星尘采集器", english: "STARDUST COLLECTOR", role: "ENERGY SUPPORT", status: "ACTIVE", description: "稳定提供星能的资源设施。\n升级缩短生产间隔，单次产量不变。" },
  { id: "DEF-002", category: "defense", type: "turret", name: "星轨炮台", english: "ORBITAL TURRET", role: "PROJECTILE DEFENSE", status: "ACTIVE", description: "晨曦防线的常规火力节点。\n发射弹体，持续攻击射程内的敌军。" },
  { id: "DEF-003", category: "defense", type: "laser", name: "光棱卫星", english: "PRISM SATELLITE", role: "BEAM DEFENSE", status: "ACTIVE", description: "远距离光束火力节点。\n以聚焦激光攻击进入射程的敌军。" },
  { id: "DEF-004", category: "defense", type: "shield", name: "引力护盾", english: "GRAVITY SHIELD", role: "DEFENSE BARRIER", status: "ACTIVE", description: "阻挡敌军推进的防御屏障。\n承受持续攻击，耐久耗尽后消散。" },
  { id: "HST-001", category: "hostile", type: "basic", english: "BASIC ENTITY", role: "CONTACT ATTACK", status: "STANDARD", description: "常规虚空单位。沿战线推进，\n接触防御设施后停下并持续攻击。" },
  { id: "HST-002", category: "hostile", type: "fast", english: "FAST ENTITY", role: "RAPID ADVANCE", status: "STANDARD", description: "高速推进的轻型单位。\n生命较低，但能更快接近防线。" },
  { id: "HST-003", category: "hostile", type: "tank", english: "HEAVY ENTITY", role: "HEAVY ADVANCE", status: "HEAVY", description: "高生命的重装单位。\n移动缓慢，以持续推进施加压力。" },
  { id: "HST-004", category: "hostile", type: "ranged", english: "RANGED ENTITY", role: "RANGED ATTACK", status: "SPECIAL", description: "在射程内停下并攻击前方设施。\n不能越过更近的建筑选择后方目标。" },
  { id: "HST-005", category: "hostile", type: "breaker", english: "SHIELD BREAKER", role: "SHIELD BREAK", status: "SPECIAL", description: "对引力护盾造成额外伤害。\n仍会被前方其他建筑阻挡。" },
  { id: "HST-006", category: "hostile", type: "leaper", english: "LEAP ENTITY", role: "SINGLE LEAP", status: "SPECIAL", description: "首次遭到阻挡时尝试跃过防御格。\n每只仅可跃迁一次，落点非法则取消。" }
];

function getArchiveRecord(id, buildingConfig = createBuildingProgressionConfig(), enemyConfig = createEnemySpawnConfig()) {
  const entry = ARCHIVE_ENTRIES.find(item => item.id === id);
  if (!entry) return null;
  const record = { ...entry, stats: [], note: "ARCHIVE NOTE" };
  if (entry.category === "defense") {
    const stats = SceneDemo.prototype.getBuildingStats.call({ buildingProgressionConfig: buildingConfig }, entry.type, 1);
    record.texture = BUILDING_VISUALS[entry.type].texture;
    record.note = "战术资料 / 初始 Lv1 · 升级后属性随等级变化";
    record.stats = entry.type === "collector"
      ? [["星能产量", `${stats.amount} / 次`], ["生产间隔", `${stats.interval.toFixed(1)} 秒`]]
      : entry.type === "shield" ? [["最大耐久", `${stats.maxHp}`]]
      : [["单次伤害", `${stats.damage}`], ["攻击间隔", `${stats.cooldown} 秒`], ["射程", `${stats.range}`]];
  } else if (entry.category === "hostile") {
    const stats = enemyConfig[entry.type];
    const phase = enemyConfig.waveCompositions.findIndex(item => (item[entry.type] || 0) > 0);
    const firstWave = stats.minWave ?? (phase > 0 ? enemyConfig.waveCompositions[phase - 1].maxWave + 1 : 1);
    record.name = SceneDemo.prototype.getEnemyDisplayName(entry.type);
    record.texture = ENEMY_VISUALS[entry.type].texture;
    record.note = "战术资料 / 同波普通体为基准 · 生命与伤害取整";
    const special = entry.type === "ranged" ? ["远程攻击距离", `${stats.attackRange}`]
      : entry.type === "breaker" ? ["对护盾伤害", `${stats.shieldDamageMultiplier * 100}%`]
      : ["作战特征", entry.type === "leaper" ? "单次跃迁" : entry.type === "fast" ? "快速推进" : entry.type === "tank" ? "重装推进" : "接触攻击"];
    record.stats = [["生命倍率", `${Math.round(stats.hpMultiplier * 100)}%`], ["移动速度", `${Math.round(stats.speedMultiplier * 100)}%`], ["攻击伤害", `${Math.round(stats.damageMultiplier * 100)}%`], ["首次出现", `第 ${firstWave} 波`], ["击杀星能", `+${stats.killReward}`], special];
  } else {
    record.stats = entry.category === "dawnstar" ? [["目标类型", "核心星球"], ["守护状态", "防线保护中"]]
      : [["异常类型", "空间入口"], ["活动状态", "活跃"]];
  }
  return record;
}

const ARCHIVE_STYLE = { ink: 0x06121f, cyan: 0x65cee8, text: "#e2edf4", muted: "#89a9bc", fadeOut: 90, fadeIn: 180, scanDuration: 850 };

function getArchiveLayout(displayWidth) {
  const compact = displayWidth < 1000;
  return {
    compact, categoryX: 40, categoryWidth: compact ? 288 : 176,
    listX: compact ? 40 : 238, listWidth: compact ? 280 : 276,
    listTop: compact ? 254 : 184, rowHeight: compact ? 70 : 80,
    detailX: compact ? 356 : 550, detailTop: compact ? 246 : 166,
    detailWidth: compact ? 884 : 690, imageSize: compact ? 238 : 260,
    dataTop: 544
  };
}

class StellarTerminalScene extends Phaser.Scene {
  constructor() {
    super("StellarTerminal");
  }

  makeText(...args) {
    return SceneDemo.prototype.makeText.call(this, ...args);
  }

  createModalButton(...args) {
    return SceneDemo.prototype.createModalButton.call(this, ...args);
  }

  beginFixedUiInteraction() {
    this.resetMenuPress();
  }

  preload() {
    // 共用纹理缓存，转场和返回星港不重复请求正式素材。
    for (const [key, path] of Object.entries(GAME_ASSET_PATHS)) {
      if (!this.textures.exists(key)) this.load.image(key, path);
    }
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.gameState = "menu";
    this.startRequested = false;
    this.terminalPanel = null;
    this.menuPress = null;
    this.menuButtons = {};
    this.ambientTweens = [];
    this.menuTitle = null;
    this.archiveUi = null;
    this.archivePress = null;
    this.input.enabled = true;
    this.createTerminalBackdrop();
    this.createMainMenu();
    this.input.on("pointerup", () => this.resetMenuPress());
    this.input.on("pointercancel", () => this.resetMenuPress());
    this.input.on("pointerupoutside", () => this.resetMenuPress());
    this.input.on("gameout", () => this.resetMenuPress());
    this.scale.on("resize", this.layoutArchive, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.tweens.killAll();
      this.time.removeAllEvents();
      this.ambientTweens = [];
      this.menuPress = null;
      this.terminalPanel = null;
      this.menuButtons = {};
      this.menuRoot = null;
      this.scale.off("resize", this.layoutArchive, this);
      this.archiveUi = null;
      this.archivePress = null;
    });
  }

  addMenuAmbient(config) {
    if (this.ambientTweens.length >= TERMINAL_STYLE.maxAmbientTweens) return;
    this.ambientTweens.push(this.tweens.add(config));
  }

  createTerminalBackdrop() {
    const backgroundKey = "bg_space_battlefield_hd";
    if (this.textures.exists(backgroundKey)) {
      this.menuBackground = this.add.image(this.W / 2, this.H / 2, backgroundKey);
      this.menuBackground.setScale(Math.max(this.W / this.menuBackground.width, this.H / this.menuBackground.height));
    } else {
      this.menuBackground = this.add.rectangle(this.W / 2, this.H / 2, this.W, this.H, 0x050a1a);
    }
    this.menuRoot = this.add.container(0, 0);
    const add = (item) => this.menuRoot.add(item);
    // 宽幅淡遮光带只为标题提供对比，不参与输入，也不覆盖整个宇宙。
    add(this.add.rectangle(290, 360, 580, 720, 0x040a18, 0.56));
    add(this.add.rectangle(598, 360, 36, 720, 0x040a18, 0.27));
    add(this.add.rectangle(626, 360, 20, 720, 0x040a18, 0.1));
    const halo = this.add.circle(948, 420, 226, 0x36c5ff, 0.035).setStrokeStyle(1, 0x78ddff, 0.24);
    add(halo);
    const orbit = this.add.ellipse(948, 424, 586, 174, 0x000000, 0).setAngle(-23).setStrokeStyle(1, 0x90c7e9, 0.2);
    add(orbit);
    this.menuPlanet = this.textures.exists("home_planet_dawnstar")
      ? this.add.image(948, 420, "home_planet_dawnstar")
      : this.add.circle(948, 420, 204, 0x146caa).setStrokeStyle(4, 0x8ae5ff, 0.6);
    if (this.menuPlanet.type === "Image") this.menuPlanet.setScale(520 / Math.max(this.menuPlanet.width, this.menuPlanet.height));
    add(this.menuPlanet);
    const riftRing = this.add.circle(992, 110, 80, 0x693dc0, 0.025).setStrokeStyle(1, 0xc99aff, 0.24);
    add(riftRing);
    this.menuPortal = this.textures.exists("void_portal")
      ? this.add.image(992, 110, "void_portal")
      : this.add.circle(992, 110, 64, 0x100822).setStrokeStyle(6, 0x8753d6, 0.7);
    if (this.menuPortal.type === "Image") this.menuPortal.setScale(180 / Math.max(this.menuPortal.width, this.menuPortal.height));
    this.menuPortal.setAlpha(0.78);
    add(this.menuPortal);
    const dust = this.add.container(0, 0);
    for (let i = 0; i < 12; i++) {
      dust.add(this.add.rectangle(688 + (i * 83) % 530, 190 + (i * 67) % 420, i % 3 === 0 ? 2 : 1, 2, 0xb7deff, 0.16 + (i % 3) * 0.08));
    }
    add(dust);
    this.addMenuAmbient({ targets: halo, alpha: 0.6, duration: 4600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.addMenuAmbient({ targets: this.menuPortal, angle: -360, duration: 140000, repeat: -1 });
    this.addMenuAmbient({ targets: riftRing, alpha: 0.45, duration: 5800, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.addMenuAmbient({ targets: dust, x: -12, y: 9, duration: 18000, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  createMainMenu() {
    if (this.menuTitle) return false;
    const text = (x, y, copy, size, color = TERMINAL_STYLE.text) => {
      const item = this.makeText(x, y, copy, { fontSize: `${size}px`, color });
      this.menuRoot.add(item);
      return item;
    };
    const left = TERMINAL_STYLE.left;
    text(left, 38, "星港终端 / STELLAR TERMINAL", 15, "#90bed5");
    this.menuVersion = text(1192, 38, GAME_VERSION, 16, "#a7b6cc").setOrigin(1, 0);
    this.menuRoot.add(this.add.rectangle(left + 25, 134, 50, 2, 0x69dcff, 0.8));
    this.menuTitle = text(left - 3, 152, "星辰寂灭", 64).setFontStyle("bold");
    this.menuTitle.setShadow(0, 2, "#3c92c5", 4, false, true);
    text(left, 245, "VOIDFALL", 33, "#c8deee");
    text(left + 1, 298, "STELLAR DEFENSE", 17, "#81a7c1");
    text(left, 335, "守护晨曦星，直到群星熄灭之前。", 18, "#acbfd2");
    text(948, 638, "晨曦星", 23, "#ccecff").setOrigin(0.5, 0);
    text(948, 675, "DAWNSTAR", 12, "#799ab5").setOrigin(0.5, 0);
    this.createTerminalButton("start", left + 180, TERMINAL_STYLE.primaryY, 360, 96, "开始守护", () => this.startFromMenu(), true);
    this.createTerminalButton("archive", left + 87, TERMINAL_STYLE.secondaryRows[0], 174, 96, "档案库", () => this.openTerminalPanel("archive"));
    this.createTerminalButton("records", left + 273, TERMINAL_STYLE.secondaryRows[0], 174, 96, "战绩", () => this.openTerminalPanel("records"));
    this.createTerminalButton("settings", left + 87, TERMINAL_STYLE.secondaryRows[1], 174, 96, "设置", () => this.openTerminalPanel("settings"));
    this.createTerminalButton("updates", left + 273, TERMINAL_STYLE.secondaryRows[1], 174, 96, "更新记录", () => this.openTerminalPanel("updates"));
    this.menuTitle.setAlpha(0).setY(162);
    this.tweens.add({ targets: this.menuTitle, alpha: 1, y: 152, duration: 700, ease: "Sine.easeOut" });
    return true;
  }

  createTerminalButton(id, x, y, width, height, label, action, primary = false) {
    const group = this.add.container(x, y);
    const fill = primary ? 0x155377 : 0x112236;
    const surface = this.add.rectangle(0, 0, width, height, fill, primary ? 0.96 : 0.82);
    surface.setStrokeStyle(1, primary ? 0x69dcff : 0x47718e, primary ? 0.8 : 0.35).setInteractive({ useHandCursor: true });
    const caption = this.makeText(0, -1, label, { fontSize: primary ? "30px" : "26px", color: TERMINAL_STYLE.text, fontStyle: primary ? "bold" : "normal" }).setOrigin(0.5);
    const accent = this.add.rectangle(-width / 2 + 2, 0, 3, primary ? 34 : 18, TERMINAL_STYLE.cyan, primary ? 0.85 : 0.35);
    group.add([surface, accent, caption]);
    this.menuRoot.add(group);
    const entry = { group, surface, caption, fill, primary, action };
    this.menuButtons[id] = entry;
    surface.on("pointerover", () => { if (!this.startRequested && !this.terminalPanel) surface.setFillStyle(primary ? 0x216e91 : 0x1c3950, 0.98); });
    surface.on("pointerout", () => { this.resetMenuPress(); surface.setFillStyle(fill, primary ? 0.96 : 0.82); });
    surface.on("pointerdown", (pointer) => {
      if (this.startRequested || this.terminalPanel || this.menuPress) return;
      this.menuPress = { entry, id: pointer.id, x: pointer.x, y: pointer.y };
      group.setScale(0.98);
    });
    surface.on("pointerup", (pointer) => {
      const press = this.menuPress;
      if (!press || press.entry !== entry || press.id !== pointer.id) return;
      this.resetMenuPress();
      if (pointer.wasCanceled || Math.hypot(pointer.x - press.x, pointer.y - press.y) > 14 ||
          this.startRequested || this.terminalPanel) return;
      action();
    });
    return entry;
  }

  resetMenuPress() {
    this.menuPress?.entry.group.setScale(1);
    this.menuPress = null;
    this.archivePress = null;
  }

  openTerminalPanel(kind) {
    if (this.startRequested || this.terminalPanel || this.gameState !== "menu") return false;
    if (kind === "archive") return this.openArchive();
    const content = {
      records: ["战绩", "守护记录将在后续版本开放", "当前没有永久战绩数据。"],
      settings: ["设置", `${GAME_VERSION}  ·  星港终端`, "STELLAR TERMINAL"],
      updates: ["更新记录", `${GAME_VERSION}  ·  星港终端`, "主界面 / 星港入口 / 返回星港\n\nv0.11.0-dev  ·  守护协议（RC）\nv0.10.0  ·  双翼防线"]
    }[kind];
    if (!content) return false;
    this.resetMenuPress();
    const elements = [];
    const overlay = this.add.rectangle(640, 360, this.W, this.H, 0x020617, 0.58).setDepth(190).setInteractive();
    const panel = this.add.rectangle(640, 360, 600, 408, UI_THEME.panel.fill, 0.96).setDepth(191);
    panel.setStrokeStyle(1, UI_THEME.panel.border, 0.65);
    elements.push(overlay, panel);
    const addText = (y, copy, size, color) => {
      const item = this.makeText(640, y, copy, { fontSize: `${size}px`, color, align: "center", lineSpacing: 9, wordWrap: { width: 520 } }).setOrigin(0.5, 0).setDepth(192);
      elements.push(item);
    };
    addText(184, content[0], 32, UI_THEME.panel.value);
    addText(249, content[1], 23, "#9ee7ff");
    addText(307, content[2], 18, UI_THEME.panel.body);
    const close = this.createModalButton(elements, 640, 512, 248, "返回", () => this.closeTerminalPanel(), true, 192);
    this.terminalPanel = { kind, elements, closeButton: close.button, overlay, panel };
    return true;
  }

  closeTerminalPanel() {
    if (!this.terminalPanel) return false;
    if (this.terminalPanel.kind === "archive") return this.closeArchive();
    SceneDemo.prototype.destroyFixedUi.call(this, this.terminalPanel);
    this.terminalPanel = null;
    this.resetMenuPress();
    return true;
  }

  // 档案只在首次打开时创建，分类、详情和扫描线都复用；退出场景才由 Phaser 统一销毁。
  createArchiveUi() {
    if (this.archiveUi) return this.archiveUi;
    const root = this.add.container(0, 0).setDepth(190);
    const text = (parent, x, y, copy, size, color = ARCHIVE_STYLE.text) => {
      const item = this.makeText(x, y, copy, { fontSize: `${size}px`, color, lineSpacing: 5 });
      item.setPadding(0, 2, 0, 2);
      parent.add(item);
      return item;
    };
    root.add(this.add.rectangle(640, 360, 1280, 720, ARCHIVE_STYLE.ink, 0.94));
    root.add(this.add.rectangle(640, 119, 1200, 1, ARCHIVE_STYLE.cyan, 0.28));
    root.add(this.add.rectangle(640, 698, 1200, 1, ARCHIVE_STYLE.cyan, 0.15));
    text(root, 40, 27, "STELLAR ARCHIVE", 34);
    text(root, 42, 78, "DAWNSTAR DEFENSE DATABASE", 17, ARCHIVE_STYLE.muted);
    const network = text(root, 698, 53, "DS-01  /  ONLINE", 16, ARCHIVE_STYLE.muted);
    text(root, 1240, 22, GAME_VERSION, 16, ARCHIVE_STYLE.muted).setOrigin(1, 0);
    const closeButton = this.add.rectangle(1134, 83, 212, 58, 0x133449, 0.85).setStrokeStyle(1, ARCHIVE_STYLE.cyan, 0.4);
    root.add(closeButton);
    text(root, 1134, 83, "‹  返回星港", 24).setOrigin(0.5);
    const categories = ARCHIVE_CATEGORIES.map(category => {
      const group = this.add.container(0, 0);
      const surface = this.add.rectangle(0, 0, 176, 100, 0x153549, 0.2);
      const accent = this.add.rectangle(1, 50, 2, 36, ARCHIVE_STYLE.cyan, 0.9);
      group.add([surface, accent]); root.add(group);
      const number = text(group, 16, 9, category.number, 16, ARCHIVE_STYLE.muted);
      const name = text(group, 16, 33, category.name, 26);
      const english = text(group, 16, 74, category.english, 14, ARCHIVE_STYLE.muted);
      this.bindArchiveAction(surface, () => this.selectArchiveCategory(category.id));
      return { ...category, group, surface, accent, number, name, english };
    });
    const listTitle = text(root, 0, 0, "ARCHIVE INDEX", 16, ARCHIVE_STYLE.muted);
    const rows = Array.from({ length: 6 }, () => {
      const group = this.add.container(0, 0);
      const surface = this.add.rectangle(0, 0, 276, 80, 0x164056, 0.2);
      const accent = this.add.rectangle(1, 40, 2, 36, ARCHIVE_STYLE.cyan, 0.8);
      const line = this.add.rectangle(138, 79, 260, 1, ARCHIVE_STYLE.cyan, 0.12);
      group.add([surface, accent, line]); root.add(group);
      const idText = text(group, 14, 5, "", 14, ARCHIVE_STYLE.muted);
      const name = text(group, 14, 25, "", 24);
      const role = text(group, 14, 57, "", 13, ARCHIVE_STYLE.muted);
      const status = text(group, 262, 5, "", 13, "#9ccdda").setOrigin(1, 0);
      for (const label of [idText, name, role, status]) label.setPadding(0);
      const row = { group, surface, accent, line, idText, name, role, status, recordId: null };
      this.bindArchiveAction(surface, () => { if (row.recordId) this.selectArchiveEntry(row.recordId); });
      return row;
    });
    const divider = this.add.rectangle(532, 420, 1, 530, ARCHIVE_STYLE.cyan, 0.2);
    root.add(divider);
    const detail = this.add.container(0, 0); root.add(detail);
    const idText = text(detail, 0, 0, "", 18, "#88d6e9");
    const readyText = text(detail, 0, 0, "DATA READY", 14, ARCHIVE_STYLE.muted).setOrigin(1, 0);
    const diagram = this.add.container(136, 180); detail.add(diagram);
    // 稀疏网格与角标只在图像区域出现，不参与输入或战场逻辑。
    for (let i = -3; i <= 3; i++) {
      diagram.add(this.add.rectangle(i * 40, 0, 1, 260, ARCHIVE_STYLE.cyan, 0.08));
      diagram.add(this.add.rectangle(0, i * 40, 260, 1, ARCHIVE_STYLE.cyan, 0.08));
    }
    for (const x of [-130, 130]) for (const y of [-130, 130]) {
      diagram.add(this.add.rectangle(x - Math.sign(x) * 10, y, 20, 1, ARCHIVE_STYLE.cyan, 0.5));
      diagram.add(this.add.rectangle(x, y - Math.sign(y) * 10, 1, 20, ARCHIVE_STYLE.cyan, 0.5));
    }
    const image = this.add.image(0, 0, "__WHITE"); diagram.add(image);
    const fallback = this.add.container(0, 0);
    fallback.add(this.add.circle(0, -8, 72, 0x12344d, 0.6).setStrokeStyle(1, ARCHIVE_STYLE.cyan, 0.6));
    fallback.add(this.add.rectangle(0, -8, 62, 62, 0x367c9a, 0.4).setAngle(45));
    text(fallback, 0, 86, "SCHEMATIC", 16, ARCHIVE_STYLE.muted).setOrigin(0.5);
    diagram.add(fallback);
    const scan = this.add.rectangle(0, -130, 260, 2, ARCHIVE_STYLE.cyan, 0.25).setAlpha(0); diagram.add(scan);
    const title = text(detail, 286, 43, "", 32);
    const english = text(detail, 286, 93, "", 16, ARCHIVE_STYLE.muted);
    const classification = text(detail, 286, 133, "", 16, "#9bcad9");
    const description = text(detail, 286, 174, "", 24);
    const note = text(detail, 0, 0, "", 18, ARCHIVE_STYLE.muted);
    const dataLine = this.add.rectangle(0, 0, 690, 1, ARCHIVE_STYLE.cyan, 0.24).setOrigin(0, 0.5); detail.add(dataLine);
    const stats = Array.from({ length: 6 }, () => {
      const group = this.add.container(0, 0); detail.add(group);
      return { group, label: text(group, 0, 0, "", 17, ARCHIVE_STYLE.muted), value: text(group, 0, 24, "", 24) };
    });
    this.archiveUi = { kind: "archive", root, elements: [root], closeButton, network, categories, rows, listTitle, divider, detail,
      idText, readyText, diagram, image, fallback, scan, title, english, classification, description, note, dataLine, stats,
      categoryId: null, selectedId: null, layout: null };
    this.bindArchiveAction(closeButton, () => this.closeArchive());
    this.layoutArchive();
    return this.archiveUi;
  }

  bindArchiveAction(surface, action) {
    surface.setInteractive({ useHandCursor: true });
    surface.on("pointerdown", pointer => {
      if (this.gameState !== "archive" || this.archivePress) return;
      this.archivePress = { surface, id: pointer.id, x: pointer.x, y: pointer.y };
    });
    surface.on("pointerup", pointer => {
      const press = this.archivePress;
      if (!press || press.surface !== surface || press.id !== pointer.id) return;
      this.archivePress = null;
      if (this.gameState === "archive" && !pointer.wasCanceled && Math.hypot(pointer.x - press.x, pointer.y - press.y) <= 14) action();
    });
    surface.on("pointerout", () => { if (this.archivePress?.surface === surface) this.archivePress = null; });
  }

  layoutArchive() {
    const ui = this.archiveUi;
    if (!ui) return;
    const layout = getArchiveLayout(this.scale.displaySize?.width ?? this.W);
    if (ui.layout?.compact === layout.compact) return;
    ui.layout = layout;
    const { compact, listX, listWidth, listTop, rowHeight, detailX, detailTop, detailWidth, imageSize } = layout;
    ui.network.setVisible(!compact);
    const sizeButton = (surface, width, height) => {
      surface.setPosition(width / 2, height / 2).setSize(width, height);
      surface.input.hitArea.setTo(0, 0, width, height);
    };
    ui.categories.forEach((item, index) => {
      item.group.setPosition(compact ? 40 + index * 300 : 40, compact ? 138 : 174 + index * 116);
      sizeButton(item.surface, layout.categoryWidth, compact ? 86 : 102);
      item.accent.setY(compact ? 43 : 50);
      item.number.setPosition(16, compact ? 10 : 9);
      item.name.setPosition(compact ? 53 : 16, compact ? 8 : 33);
      item.english.setY(compact ? 52 : 74);
    });
    ui.listTitle.setPosition(listX + 14, listTop - 30);
    ui.rows.forEach((row, index) => {
      row.group.setPosition(listX, listTop + index * rowHeight);
      sizeButton(row.surface, listWidth, rowHeight - 2);
      row.accent.setY(rowHeight / 2);
      row.line.setPosition(listWidth / 2, rowHeight - 1).setSize(listWidth - 28, 1);
      row.status.setX(listWidth - 14);
      row.name.setY(compact ? 23 : 26);
      row.role.setY(compact ? 53 : 60);
    });
    ui.divider.setPosition(detailX - 18, (listTop + 688) / 2).setSize(1, 688 - listTop);
    ui.detail.setPosition(detailX, detailTop);
    ui.readyText.setPosition(detailWidth, 0);
    ui.diagram.setScale(imageSize / 260).setY(compact ? 162 : 185);
    ui.description.setWordWrapWidth(detailWidth - 290, true);
    ui.classification.setWordWrapWidth(detailWidth - 290, true);
    ui.note.setPosition(0, layout.dataTop - detailTop);
    ui.dataLine.setPosition(0, layout.dataTop - detailTop - 14).setSize(detailWidth, 1);
    ui.stats.forEach((stat, index) => stat.group.setPosition((index % 3) * detailWidth / 3, layout.dataTop - detailTop + 33 + Math.floor(index / 3) * 58));
    if (ui.selectedId) this.selectArchiveEntry(ui.selectedId, false);
  }

  openArchive() {
    if (this.gameState !== "menu" || this.terminalPanel || this.startRequested) return false;
    this.resetMenuPress();
    const ui = this.createArchiveUi();
    this.gameState = "archive";
    this.terminalPanel = ui;
    this.menuRoot.setVisible(false);
    this.ambientTweens.forEach(tween => tween.pause());
    ui.root.setVisible(true).setActive(true);
    ui.closeButton.input.enabled = true;
    ui.categories.forEach(item => { item.surface.input.enabled = true; });
    this.selectArchiveCategory(ui.categoryId || "dawnstar", false);
    return true;
  }

  selectArchiveCategory(categoryId, animate = true) {
    const ui = this.archiveUi;
    if (this.gameState !== "archive" || !ARCHIVE_CATEGORIES.some(item => item.id === categoryId)) return false;
    const entries = ARCHIVE_ENTRIES.filter(item => item.category === categoryId);
    const selectedId = ui.categoryId === categoryId && entries.some(item => item.id === ui.selectedId) ? ui.selectedId : entries[0].id;
    ui.categoryId = categoryId;
    ui.categories.forEach(item => {
      const selected = item.id === categoryId;
      item.surface.setFillStyle(0x153e53, selected ? 0.7 : 0.12);
      item.accent.setVisible(selected);
    });
    ui.rows.forEach((row, index) => {
      const entry = entries[index];
      row.recordId = entry?.id || null;
      row.group.setVisible(!!entry).setActive(!!entry);
      row.surface.input.enabled = !!entry;
      if (!entry) return;
      row.idText.setText(entry.id);
      row.name.setText(entry.name || SceneDemo.prototype.getEnemyDisplayName(entry.type));
      row.role.setText(entry.role);
      row.status.setText(entry.status);
    });
    return this.selectArchiveEntry(selectedId, animate);
  }

  stopArchiveTransition() {
    const ui = this.archiveUi;
    if (!ui) return;
    this.tweens.killTweensOf([ui.detail, ui.scan]);
    ui.scan.setAlpha(0);
  }

  selectArchiveEntry(id, animate = true) {
    const ui = this.archiveUi;
    const record = getArchiveRecord(id);
    if (this.gameState !== "archive" || !record || record.category !== ui.categoryId) return false;
    this.stopArchiveTransition();
    ui.selectedId = id;
    ui.rows.forEach(row => {
      const selected = row.recordId === id;
      row.accent.setVisible(selected);
      row.surface.setFillStyle(0x1d5269, selected ? 0.48 : 0.06);
    });
    const show = () => {
      ui.record = record;
      ui.idText.setText(`ARCHIVE ID / ${record.id}`);
      ui.title.setText(record.name);
      ui.english.setText(record.english);
      ui.classification.setText(`${record.role} / ${record.status}`);
      ui.description.setText(record.description);
      ui.note.setText(record.note);
      const hasTexture = this.textures.exists(record.texture);
      ui.image.setVisible(hasTexture);
      ui.fallback.setVisible(!hasTexture);
      if (hasTexture) {
        ui.image.setTexture(record.texture);
        ui.image.setScale(242 / Math.max(ui.image.width, ui.image.height));
      }
      ui.stats.forEach((stat, index) => {
        const pair = record.stats[index];
        stat.group.setVisible(!!pair);
        if (pair) { stat.label.setText(pair[0]); stat.value.setText(pair[1]); }
      });
      ui.detail.setAlpha(animate ? 0.2 : 1).setY(ui.layout.detailTop + (animate ? 4 : 0));
      if (animate) {
        this.tweens.add({ targets: ui.detail, alpha: 1, y: ui.layout.detailTop, duration: ARCHIVE_STYLE.fadeIn, ease: "Sine.easeOut" });
        ui.scan.setY(-130).setAlpha(0.3);
        this.tweens.add({ targets: ui.scan, y: 130, duration: ARCHIVE_STYLE.scanDuration, ease: "Sine.easeInOut", onComplete: () => ui.scan.setAlpha(0) });
      }
    };
    if (animate) this.tweens.add({ targets: ui.detail, alpha: 0.15, duration: ARCHIVE_STYLE.fadeOut, onComplete: show });
    else show();
    return true;
  }

  closeArchive() {
    if (this.gameState !== "archive") return false;
    const ui = this.archiveUi;
    this.stopArchiveTransition();
    ui.root.setVisible(false).setActive(false);
    for (const surface of [ui.closeButton, ...ui.categories.map(item => item.surface), ...ui.rows.map(row => row.surface)]) surface.input.enabled = false;
    this.menuRoot.setVisible(true);
    this.ambientTweens.forEach(tween => tween.resume());
    this.gameState = "menu";
    this.terminalPanel = null;
    this.resetMenuPress();
    return true;
  }

  startFromMenu() {
    if (this.gameState !== "menu" || this.startRequested || this.terminalPanel) return false;
    this.startRequested = true;
    this.gameState = "departing";
    this.input.enabled = false;
    this.resetMenuPress();
    this.tweens.killAll();
    this.tweens.add({
      targets: this.menuRoot, alpha: 0, duration: TERMINAL_STYLE.exitDuration, ease: "Sine.easeInOut",
      onComplete: () => this.scene.start("SceneDemo", { fromMenu: true })
    });
    return true;
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#030712",
  scene: [StellarTerminalScene, SceneDemo],

  resolution: Math.min(window.devicePixelRatio || 1, 2),

  // 浏览器手势由 Canvas touch-action 与页面监听抑制，避免引擎取消不可取消的 touchcancel。
  input: { touch: { capture: false } },

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
