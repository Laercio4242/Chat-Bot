import { getCustomRepository, Repository } from "typeorm";
import { Settings } from "../entities/Setting";
import { SettingsRepository } from "../repositories/Settings.Repository";

interface ISettingsCreate {
    chat: boolean;
    username: string;
}

class SettingsService {

    private settingsRepository: Repository<Settings>;

    constructor() {
        this.settingsRepository = getCustomRepository(SettingsRepository);
    }

    async create({ chat, username } : ISettingsCreate) {
        
        const userAlreadyExists = await this.settingsRepository.findOne({
            username
        });

        if(userAlreadyExists) {
            throw new Error("Usuário já existe");
        }

        const settings = this.settingsRepository.create({
            chat,
            username
        })

        await this.settingsRepository.save(settings);

        return settings;
    }

    async update(username: string, chat: boolean) {
        await this.settingsRepository.createQueryBuilder().update(Settings)
        .set({chat})
        .where("username = :username", {
            username
        }).execute();
    }

    async findByUsername(username: string) {
        const settings = await this.settingsRepository.findOne({
            username
        });
        
        return settings;
    }
}

export { SettingsService }