import assert from "node:assert/strict";
import { parseLegacyOutput } from "../core/legacy/LegacyParser.ts";

const events = parseLegacyOutput("[我方消息|回来啦|22:30]\n[对方转账|avatar|88|晚饭]\n<日记>今天下雨</日记>");
assert.equal(events[0].type, "message.text");
assert.equal(events[0].actorId, "user");
assert.equal(events[1].type, "interaction.transfer");
assert.equal(events[2].type, "diary.entry");
console.log(`legacy parser check passed (${events.length} events)`);
