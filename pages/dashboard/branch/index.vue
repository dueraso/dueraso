<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <v-row class="pa-3 mt-1" style="background: #eef7f6">
            <h5 class="mb-0 ml-4" style="color: #00000080">
              <v-icon x-large>mdi-clipboard-edit-outline</v-icon>
              รายรับ-รายจ่าย
            </h5>
            <v-spacer/>
            <v-btn outlined @click="openItem({})" class="mr-3">
              <v-icon>mdi-plus</v-icon>
              เพิ่ม
            </v-btn>
          </v-row>
          <v-col>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                <tr>
                  <th v-for="(item, i) in tableHead" :key="i" class="text-left" style="font-size: 14px"
                      :width="item.width">{{ item.title }}
                  </th>
                  <th width="120">
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.data" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.user }}</td>
                  <td>{{ item.create_by.name }}</td>
                  <td>{{ item.status }}</td>
                  <td>{{ item.permissions }}</td>
                  <td>{{ item.created_at }}</td>
                  <td class="p-0 text-right">
                    <v-btn fab small text @click="openItem(item)">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="text-center">
              <v-dialog
                v-model="dialog"
                width="500"
                persistent
              >
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2 mb-3">
                    Privacy Policy
                  </v-card-title>

                  <v-card-text>
                    <v-text-field
                      v-model="item.title"
                      label="title"
                      outlined
                      clearable
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="item.detail"
                      label="detail"
                      outlined
                      clearable
                      dense
                    ></v-text-field>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="confirm"
                    >
                      ok
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
