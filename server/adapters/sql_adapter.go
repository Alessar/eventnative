package adapters

//SQLAdapter is a manager for DWH tables
type SQLAdapter interface {
	Insert(eventContext *EventContext) error
	GetTableSchema(tableName string) (*Table, error)
	CreateTable(schemaToCreate *Table) error
	PatchTableSchema(schemaToAdd *Table) error
	DeleteTable(schemaToDelete *Table) error
}
