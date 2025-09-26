import { BaseEntity } from "./BaseEntity";

export interface ICategory extends BaseEntity {
    name: string;
    title: string;
}