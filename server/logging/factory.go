package logging

import (
	"io"
	"path"
)

const (
	ArchiveDir  = "archive"
	FailedDir   = "failed"
	IncomingDir = "incoming"
)

type Factory struct {
	logEventPath   string
	logRotationMin int64
	showInServer   bool

	ddlLogsWriter   io.Writer
	queryLogsWriter io.Writer
}

func NewFactory(logEventPath string, logRotationMin int64, showInServer bool, ddlLogsWriter io.Writer, queryLogsWriter io.Writer) *Factory {
	return &Factory{
		logEventPath:    logEventPath,
		logRotationMin:  logRotationMin,
		showInServer:    showInServer,
		ddlLogsWriter:   ddlLogsWriter,
		queryLogsWriter: queryLogsWriter,
	}
}

//NewFactoryWithDDLLogsWriter returns a new factory instance with overridden DDL debug logs writer
func (f *Factory) NewFactoryWithDDLLogsWriter(overriddenDDLLogsWriter io.Writer) *Factory {
	return &Factory{
		logEventPath:    f.logEventPath,
		logRotationMin:  f.logRotationMin,
		showInServer:    f.showInServer,
		ddlLogsWriter:   overriddenDDLLogsWriter,
		queryLogsWriter: f.queryLogsWriter,
	}
}

//NewFactoryWithQueryLogsWriter returns a new factory instance with overridden sql query debug logs writer
func (f *Factory) NewFactoryWithQueryLogsWriter(overriddenQueryLogsWriter io.Writer) *Factory {
	return &Factory{
		logEventPath:    f.logEventPath,
		logRotationMin:  f.logRotationMin,
		showInServer:    f.showInServer,
		ddlLogsWriter:   f.ddlLogsWriter,
		queryLogsWriter: overriddenQueryLogsWriter,
	}
}

func (f *Factory) CreateIncomingLogger(tokenID string) *AsyncLogger {
	eventLogWriter := NewRollingWriter(&Config{
		FileName:      "incoming.tok=" + tokenID,
		FileDir:       path.Join(f.logEventPath, IncomingDir),
		RotationMin:   f.logRotationMin,
		RotateOnClose: true,
	})

	return NewAsyncLogger(eventLogWriter, f.showInServer)
}

func (f *Factory) CreateFailedLogger(destinationName string) *AsyncLogger {
	if f == nil {
		return nil
	}

	return NewAsyncLogger(NewRollingWriter(&Config{
		FileName:      "failed.dst=" + destinationName,
		FileDir:       path.Join(f.logEventPath, FailedDir),
		RotationMin:   f.logRotationMin,
		RotateOnClose: true,
	}), false)
}

func (f *Factory) CreateSQLQueryLogger(destinationName string) *QueryLogger {
	if f == nil {
		return nil
	}

	return NewQueryLogger(destinationName, f.ddlLogsWriter, f.queryLogsWriter)
}

func (f *Factory) CreateStreamingArchiveLogger(destinationName string) *AsyncLogger {
	if f == nil {
		return nil
	}

	return NewAsyncLogger(NewRollingWriter(&Config{
		FileName:      "streaming-archive.dst=" + destinationName,
		FileDir:       path.Join(f.logEventPath, ArchiveDir),
		RotationMin:   f.logRotationMin,
		RotateOnClose: true,
	}), false)
}
