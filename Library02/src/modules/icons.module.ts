import type { App } from "vue";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as CoIcons from "oh-vue-icons/icons/co";
import * as HiIcons from "oh-vue-icons/icons/hi";
import * as MdIcons from "oh-vue-icons/icons/md";
import * as FaIcons from "oh-vue-icons/icons/fa";
import * as PrIcons from "oh-vue-icons/icons/pr";
import * as RiIcons from "oh-vue-icons/icons/ri";
import * as BiIcons from "oh-vue-icons/icons/bi";
import * as IoIcons from "oh-vue-icons/icons/io";

const icons = Object.values({
  ...HiIcons,
  ...MdIcons,
  ...CoIcons,
  ...FaIcons,
  ...PrIcons,
  ...RiIcons,
  ...BiIcons,
  ...IoIcons,
});

addIcons(...icons);

export default function setIcons(app: App): void {
  app.component("v-icon", OhVueIcon);
}
