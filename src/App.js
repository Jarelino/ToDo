import Model from './Model';
import View from './View';
import Controller from './Controller';
import { save, load } from './helpers';

const model = new Model();
const view = new View();
const controller = new Controller(model, view);