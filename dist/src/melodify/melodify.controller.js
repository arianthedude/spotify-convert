"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MelodifyController = void 0;
const common_1 = require("@nestjs/common");
const melodify_service_1 = require("./melodify.service");
let MelodifyController = class MelodifyController {
    melodifyService;
    constructor(melodifyService) {
        this.melodifyService = melodifyService;
    }
    async sync(tracks) {
        return this.melodifyService.syncSongsToMelodify();
    }
};
exports.MelodifyController = MelodifyController;
__decorate([
    (0, common_1.Get)('sync'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MelodifyController.prototype, "sync", null);
exports.MelodifyController = MelodifyController = __decorate([
    (0, common_1.Controller)('melodify'),
    __metadata("design:paramtypes", [melodify_service_1.MelodifyService])
], MelodifyController);
//# sourceMappingURL=melodify.controller.js.map