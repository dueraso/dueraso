<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading..</v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar :title="headTitle" :callback="openItem" per="add.modules">
            <v-btn
              color="#B27D41"
              outlined
              rounded
              class="ml-3"
              @click="saveModules"
              :loading="saving"
              small
            >
              <v-icon left small>mdi-content-save</v-icon>
              บันทึก
            </v-btn>
          </head-bar>

          <v-col>
            <v-row>
              <!-- Left side: All modules -->
              <v-col cols="12" md="6">
                <v-card
                  class="pa-4"
                  style="
                    border-radius: 15px;
                    box-shadow: 5px 5px 10px rgba(119, 66, 26, 0.16);
                  "
                >
                  <h6 class="mb-3" style="color: #846537">
                    <v-icon color="#846537" class="mr-2"
                      >mdi-format-list-bulleted</v-icon
                    >
                    รายการ Modules ทั้งหมด ({{ modules.length }})
                  </h6>
                  <p class="text-muted mb-3" style="font-size: 13px">
                    ลากวางเพื่อจัดลำดับและจัดหมวดหมู่
                  </p>

                  <div
                    class="modules-container"
                    @dragover.prevent
                    @drop="dropToRoot($event)"
                  >
                    <div
                      v-for="(mod, index) in modules"
                      :key="mod.id || index"
                      class="module-item"
                      :class="{
                        'has-children': mod.children && mod.children.length > 0,
                      }"
                      draggable="true"
                      @dragstart="dragStart($event, mod, index, null)"
                      @dragover.prevent
                      @drop="dropOnItem($event, mod, index)"
                      @dragend="dragEnd"
                    >
                      <div class="module-content">
                        <v-icon class="drag-handle mr-2">mdi-drag</v-icon>
                        <v-icon class="mr-2" color="#B27D41">{{
                          mod.icon || "mdi-folder"
                        }}</v-icon>
                        <div class="module-info">
                          <span class="module-title">{{ mod.title }}</span>
                          <span class="module-path text-muted">{{
                            mod.diractory || "ไม่มี path"
                          }}</span>
                        </div>
                        <v-spacer></v-spacer>
                        <v-chip
                          v-if="mod.children && mod.children.length > 0"
                          small
                          color="#E8AE0F"
                          text-color="white"
                          class="mr-2"
                        >
                          {{ mod.children.length }}
                        </v-chip>
                        <v-btn icon small @click.stop="openItem(mod)">
                          <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon small @click.stop="onDelete(mod)">
                          <v-icon small color="error"
                            >mdi-delete-outline</v-icon
                          >
                        </v-btn>
                      </div>

                      <!-- Children -->
                      <div
                        v-if="mod.children && mod.children.length > 0"
                        class="children-container"
                      >
                        <div
                          v-for="(child, childIndex) in mod.children"
                          :key="child.id || childIndex"
                          class="module-item child-item"
                          draggable="true"
                          @dragstart.stop="
                            dragStart($event, child, childIndex, index)
                          "
                          @dragover.prevent.stop
                          @drop.stop="
                            dropOnChild($event, child, childIndex, index)
                          "
                          @dragend="dragEnd"
                        >
                          <div class="module-content">
                            <v-icon class="drag-handle mr-2">mdi-drag</v-icon>
                            <v-icon class="mr-2" color="#846537">{{
                              child.icon || "mdi-file"
                            }}</v-icon>
                            <div class="module-info">
                              <span class="module-title">{{
                                child.title
                              }}</span>
                              <span class="module-path text-muted">{{
                                child.diractory || "ไม่มี path"
                              }}</span>
                            </div>
                            <v-spacer></v-spacer>
                            <v-btn icon small @click.stop="openItem(child)">
                              <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon small @click.stop="onDelete(child)">
                              <v-icon small color="error"
                                >mdi-delete-outline</v-icon
                              >
                            </v-btn>
                          </div>
                        </div>
                      </div>

                      <!-- Drop zone for adding children -->
                      <div
                        class="drop-zone"
                        @dragover.prevent
                        @dragenter="dragEnterZone($event)"
                        @dragleave="dragLeaveZone($event)"
                        @drop.stop="dropAsChild($event, index)"
                      >
                        <v-icon small>mdi-plus</v-icon>
                        วางที่นี่เพื่อเพิ่มเป็นรายการย่อย
                      </div>
                    </div>

                    <div v-if="modules.length === 0" class="empty-state">
                      <v-icon size="64" color="#ccc">mdi-folder-outline</v-icon>
                      <p>ยังไม่มี Module</p>
                    </div>
                  </div>
                </v-card>
              </v-col>

              <!-- Right side: Preview -->
              <v-col cols="12" md="6">
                <v-card
                  class="pa-4"
                  style="
                    border-radius: 15px;
                    box-shadow: 5px 5px 10px rgba(119, 66, 26, 0.16);
                  "
                >
                  <h6 class="mb-3" style="color: #846537">
                    <v-icon color="#846537" class="mr-2">mdi-eye</v-icon>
                    ตัวอย่างเมนู
                  </h6>

                  <v-card outlined class="preview-card">
                    <v-list dense>
                      <template v-for="(mod, i) in modules">
                        <v-list-group
                          v-if="mod.children && mod.children.length > 0"
                          :key="'group-' + i"
                          :value="true"
                          color="#B27D41"
                        >
                          <template v-slot:activator>
                            <v-list-item-icon class="mr-2">
                              <v-icon>{{ mod.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>{{
                                mod.title
                              }}</v-list-item-title>
                            </v-list-item-content>
                          </template>

                          <v-list-item
                            v-for="(child, j) in mod.children"
                            :key="'child-' + j"
                            class="pl-8"
                          >
                            <v-list-item-icon class="mr-2">
                              <v-icon small>{{ child.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>{{
                                child.title
                              }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-group>

                        <v-list-item v-else :key="'item-' + i">
                          <v-list-item-icon class="mr-2">
                            <v-icon>{{ mod.icon }}</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>{{
                              mod.title
                            }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-card>
                </v-card>
              </v-col>
            </v-row>

            <!-- Add/Edit Dialog -->
            <dialog-mid
              v-model="dialog"
              title="เพิ่ม/แก้ไข Module"
              :callback="confirm"
              width="500"
            >
              <v-row class="m-0">
                <v-col class="pb-0 pt-3" md="12">
                  <v-text-field
                    v-model="item.title"
                    label="ชื่อ Module *"
                    outlined
                    dense
                    style="border-radius: 15px"
                    :rules="[rules.required]"
                    placeholder="เช่น จัดการหน้าแรก"
                  />
                </v-col>
                <v-col class="pb-0 pt-0" md="12">
                  <v-text-field
                    v-model="item.diractory"
                    label="Path (เช่น /admin/home)"
                    outlined
                    dense
                    style="border-radius: 15px"
                    placeholder="/admin/..."
                  />
                </v-col>
                <v-col class="pb-0 pt-0" md="12">
                  <v-select
                    v-model="item.icon"
                    :items="iconOptions"
                    label="ไอคอน"
                    outlined
                    dense
                    style="border-radius: 15px"
                  >
                    <template v-slot:item="{ item }">
                      <v-icon class="mr-2">{{ item }}</v-icon>
                      {{ item }}
                    </template>
                    <template v-slot:selection="{ item }">
                      <v-icon class="mr-2">{{ item }}</v-icon>
                      {{ item }}
                    </template>
                  </v-select>
                </v-col>
                <v-col class="pb-0 pt-0" md="12">
                  <v-switch
                    v-model="item.isParent"
                    label="เป็นหัวข้อหลัก (มีรายการย่อย)"
                    color="#B27D41"
                    inset
                  />
                </v-col>
              </v-row>
            </dialog-mid>

            <dialog-delete v-model="dialogDelete" :confirm="confirmDel" />
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #a57156;
}

.modules-container {
  min-height: 300px;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 12px;
  border: 2px dashed #e0e0e0;
}

.module-item {
  background: white;
  border-radius: 10px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: grab;
}

.module-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.module-item.dragging {
  opacity: 0.5;
  transform: scale(1.02);
}

.module-content {
  display: flex;
  align-items: center;
  padding: 10px 12px;
}

.module-info {
  display: flex;
  flex-direction: column;
}

.module-title {
  font-weight: 500;
  color: #5b4840;
  font-size: 14px;
}

.module-path {
  font-size: 11px;
}

.drag-handle {
  cursor: grab;
  color: #999;
}

.drag-handle:hover {
  color: #b27d41;
}

.children-container {
  padding: 0 12px 8px 28px;
}

.child-item {
  background: #f5f5f5;
  margin-bottom: 4px;
}

.child-item .module-content {
  padding: 8px 10px;
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 6px;
  margin: 6px 12px 10px 28px;
  text-align: center;
  color: #999;
  font-size: 11px;
  transition: all 0.2s ease;
}

.drop-zone:hover,
.drop-zone.drag-over {
  border-color: #b27d41;
  background-color: rgba(178, 125, 65, 0.1);
  color: #b27d41;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.preview-card {
  border-radius: 10px;
  min-height: 300px;
  background: white;
}

.text-muted {
  color: #999;
}
</style>

<script src="./index.js" />
