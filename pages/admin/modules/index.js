import auth from "@/middleware/auth";
import convert from "@/plugins/convert";

export default {
  layout: "admin-layout",
  middleware: auth,
  head() {
    return {
      title: this.headTitle,
    };
  },
  data() {
    return {
      headTitle: "จัดการ Modules",
      loading: true,
      dialog: false,
      dialogDelete: false,
      saving: false,

      modules: [],
      item: {
        title: "",
        diractory: "",
        icon: "mdi-folder",
        isParent: false,
      },

      // Drag state
      draggedItem: null,
      draggedIndex: null,
      draggedParentIndex: null,

      // Edit state
      editingParentIndex: null,
      editingChildIndex: null,

      // Icon list
      iconOptions: [
        "mdi-home-variant-outline",
        "mdi-folder-home-outline",
        "mdi-newspaper-variant-multiple",
        "mdi-help-box-multiple-outline",
        "mdi-card-account-phone-outline",
        "mdi-gift-open",
        "mdi-apple-keyboard-command",
        "mdi-chart-box-multiple-outline",
        "mdi-police-badge-outline",
        "mdi-cookie-outline",
        "mdi-account-group",
        "mdi-cog-outline",
        "mdi-shield-account",
        "mdi-file-document-outline",
        "mdi-image-outline",
        "mdi-cart-outline",
        "mdi-tag-outline",
        "mdi-bell-outline",
        "mdi-email-outline",
        "mdi-calendar-outline",
        "mdi-chart-line",
        "mdi-file-chart",
        "mdi-database",
        "mdi-folder",
        "mdi-file",
        "mdi-view-module",
      ],

      rules: {
        required: (value) => !!value || "จำเป็น",
      },
    };
  },
  computed: {
    convert() {
      return convert;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false;
      this.getData();
    });
  },
  methods: {
    // Load modules
    async getData() {
      this.$nuxt.$loading.start();
      try {
        // Try to load from localStorage first
        const saved = localStorage.getItem("admin_modules");
        if (saved) {
          this.modules = JSON.parse(saved);
        } else {
          // Default modules
          this.modules = [
            {
              id: 1,
              title: "แดชบอร์ด",
              icon: "mdi-home-variant-outline",
              diractory: "/admin",
            },
            {
              id: 2,
              title: "จัดการหน้าแรก",
              icon: "mdi-folder-home-outline",
              diractory: "/admin/home",
            },
            {
              id: 3,
              title: "จัดการบทความ",
              icon: "mdi-newspaper-variant-multiple",
              diractory: "/admin/blog",
            },
            {
              id: 4,
              title: "จัดการคำถาม",
              icon: "mdi-help-box-multiple-outline",
              diractory: "/admin/faq",
            },
            {
              id: 5,
              title: "จัดการติดต่อเรา",
              icon: "mdi-card-account-phone-outline",
              diractory: "/admin/contact-us",
            },
            {
              id: 6,
              title: "จัดการแพ็คเกจ",
              icon: "mdi-gift-open",
              diractory: "/admin/package",
            },
            {
              id: 7,
              title: "จัดการแอปพลิเคชัน",
              icon: "mdi-apple-keyboard-command",
              diractory: "/admin/all-apps",
            },
            {
              id: 8,
              title: "รายงาน",
              icon: "mdi-chart-box-multiple-outline",
              children: [
                {
                  id: 81,
                  title: "รายงานการใช้งาน",
                  icon: "mdi-chart-line",
                  diractory: "/admin/report/usage",
                },
                {
                  id: 82,
                  title: "รายงานสรุป",
                  icon: "mdi-file-chart",
                  diractory: "/admin/report/summary",
                },
              ],
            },
          ];
        }
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    // Save modules
    async saveModules() {
      this.saving = true;
      this.$nuxt.$loading.start();
      try {
        // Save to localStorage (can be changed to API call)
        localStorage.setItem("admin_modules", JSON.stringify(this.modules));

        // TODO: Save to API
        // await this.$axios.post('/api/admin/modules', { modules: this.modules });

        this.$nuxt.$loading.finish();
        this.saving = false;
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
        this.saving = false;
      }
    },

    // Drag & Drop handlers
    dragStart(event, item, index, parentIndex) {
      this.draggedItem = JSON.parse(JSON.stringify(item));
      this.draggedIndex = index;
      this.draggedParentIndex = parentIndex;
      event.dataTransfer.effectAllowed = "move";
      event.target.classList.add("dragging");
    },

    dragEnd(event) {
      event.target.classList.remove("dragging");
      this.draggedItem = null;
      this.draggedIndex = null;
      this.draggedParentIndex = null;

      // Remove all drag-over classes
      document.querySelectorAll(".drag-over").forEach((el) => {
        el.classList.remove("drag-over");
      });
    },

    dragEnterZone(event) {
      event.target.classList.add("drag-over");
    },

    dragLeaveZone(event) {
      event.target.classList.remove("drag-over");
    },

    // Drop to root level
    dropToRoot(event) {
      if (!this.draggedItem) return;

      // Remove from original position
      this.removeFromOriginal();

      // Add to root
      this.modules.push(this.draggedItem);
    },

    // Drop on another item (reorder)
    dropOnItem(event, targetItem, targetIndex) {
      if (!this.draggedItem) return;
      if (this.draggedItem.id === targetItem.id) return;

      // Remove from original position
      this.removeFromOriginal();

      // Insert at new position
      this.modules.splice(targetIndex, 0, this.draggedItem);
    },

    // Drop as child of an item
    dropAsChild(event, parentIndex) {
      if (!this.draggedItem) return;

      const parent = this.modules[parentIndex];

      // Don't allow dropping parent onto itself
      if (this.draggedItem.id === parent.id) return;

      // Don't allow item with children to become a child
      if (this.draggedItem.children && this.draggedItem.children.length > 0) {
        return;
      }

      // Remove from original position
      this.removeFromOriginal();

      // Add as child
      if (!parent.children) {
        this.$set(parent, "children", []);
      }
      parent.children.push(this.draggedItem);

      // Remove drop zone highlight
      event.target.classList.remove("drag-over");
    },

    // Drop on a child item (reorder within children)
    dropOnChild(event, targetChild, targetChildIndex, parentIndex) {
      if (!this.draggedItem) return;
      if (this.draggedItem.id === targetChild.id) return;

      // Don't allow item with children to become a child
      if (this.draggedItem.children && this.draggedItem.children.length > 0) {
        return;
      }

      // Remove from original position
      this.removeFromOriginal();

      // Insert at new position in children
      const parent = this.modules[parentIndex];
      if (!parent.children) {
        this.$set(parent, "children", []);
      }
      parent.children.splice(targetChildIndex, 0, this.draggedItem);
    },

    // Remove item from original position
    removeFromOriginal() {
      if (this.draggedParentIndex !== null) {
        // Was a child
        this.modules[this.draggedParentIndex].children.splice(
          this.draggedIndex,
          1
        );
      } else {
        // Was at root
        this.modules.splice(this.draggedIndex, 1);
      }
    },

    // Dialog methods
    openItem(val = {}) {
      if (val.id) {
        // Editing existing item
        this.item = Object.assign({}, val);
        this.item.isParent = !!(val.children && val.children.length > 0);

        // Find the index
        const rootIndex = this.modules.findIndex((m) => m.id === val.id);
        if (rootIndex !== -1) {
          this.editingParentIndex = null;
          this.editingChildIndex = rootIndex;
        } else {
          // Find in children
          for (let i = 0; i < this.modules.length; i++) {
            if (this.modules[i].children) {
              const childIndex = this.modules[i].children.findIndex(
                (c) => c.id === val.id
              );
              if (childIndex !== -1) {
                this.editingParentIndex = i;
                this.editingChildIndex = childIndex;
                break;
              }
            }
          }
        }
      } else {
        // New item
        this.item = {
          title: "",
          diractory: "",
          icon: "mdi-folder",
          isParent: false,
        };
        this.editingParentIndex = null;
        this.editingChildIndex = null;
      }
      this.dialog = true;
    },

    async confirm() {
      this.$nuxt.$loading.start();
      if (this.item.id) {
        await this.onUpdate();
      } else {
        await this.onCreate();
      }
    },

    async onCreate() {
      try {
        const newItem = {
          id: Date.now(),
          title: this.item.title,
          diractory: this.item.diractory || null,
          icon: this.item.icon,
        };

        if (this.item.isParent) {
          newItem.children = [];
        }

        this.modules.push(newItem);
        this.dialog = false;
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async onUpdate() {
      try {
        const updatedItem = {
          id: this.item.id,
          title: this.item.title,
          diractory: this.item.diractory || null,
          icon: this.item.icon,
        };

        // Preserve children if exists
        if (this.item.children) {
          updatedItem.children = this.item.children;
        } else if (this.item.isParent) {
          updatedItem.children = [];
        }

        if (this.editingParentIndex !== null) {
          this.$set(
            this.modules[this.editingParentIndex].children,
            this.editingChildIndex,
            updatedItem
          );
        } else {
          this.$set(this.modules, this.editingChildIndex, updatedItem);
        }

        this.dialog = false;
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    // Delete methods
    onDelete(val) {
      this.item = Object.assign({}, val);
      this.dialogDelete = true;
    },

    async confirmDel() {
      try {
        // Find and remove
        const rootIndex = this.modules.findIndex((m) => m.id === this.item.id);
        if (rootIndex !== -1) {
          this.modules.splice(rootIndex, 1);
        } else {
          // Find in children
          for (let i = 0; i < this.modules.length; i++) {
            if (this.modules[i].children) {
              const childIndex = this.modules[i].children.findIndex(
                (c) => c.id === this.item.id
              );
              if (childIndex !== -1) {
                this.modules[i].children.splice(childIndex, 1);
                break;
              }
            }
          }
        }

        this.dialogDelete = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
