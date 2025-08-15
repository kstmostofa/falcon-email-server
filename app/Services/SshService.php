<?php

namespace App\Services;

use DivineOmega\SSHConnection\SSHConnection;
use Exception;

class SshService
{
    protected string $host;
    protected int $port = 22;
    protected string $username;
    protected string $password;
    protected string $privateKeyPath;
    protected int $timeout = 10;

    protected $connection;

    public function __construct(string $host, string $username, ?string $password, ?string $privateKeyPath, int $port = 22, int $timeout = 10)
    {
        $this->host = $host;
        $this->port = $port;
        $this->username = $username;
        $this->password = $password;
        $this->timeout = $timeout;
        $this->privateKeyPath = $privateKeyPath;
    }

    public function connect($host = null, $username = null, $password = null, $privateKeyPath = null, $port = null, $timeout = null): SSHConnection
    {
        if ($host) {
            $this->host = $host;
        }
        if ($username) {
            $this->username = $username;
        }
        if ($password) {
            $this->password = $password;
        }
        if ($privateKeyPath) {
            $this->privateKeyPath = $privateKeyPath;
        }
        if ($port) {
            $this->port = $port;
        }
        if ($timeout) {
            $this->timeout = $timeout;
        }

        return $this->establishConnection();
    }

    protected function establishConnection(): SSHConnection
    {
        try {
            $connection = (new SSHConnection())
                ->to($this->host)
                ->onPort($this->port)
                ->as($this->username)
                ->timeout($this->timeout);
            if ($this->password !== null) {
                $connection->withPassword($this->password);
            }

            if ($this->privateKeyPath !== null) {
                $connection->withPrivateKey($this->privateKeyPath);
            }

            $this->connection = $connection->connect();

            if (!$this->connection->isConnected()) {
                throw new Exception('SSH connection failed');
            }

            return $this->connection;
        } catch (Exception $e) {
            throw new Exception('SSH connection error: ' . $e->getMessage());
        }
    }

    public function execute(string $command): string
    {
        if (!$this->connection || !$this->connection->isConnected()) {
            throw new Exception('No active SSH connection');
        }

        try {
            $result = $this->connection->run($command);
            return $result->getOutput();
        } catch (Exception $e) {
            throw new Exception('Command execution error: ' . $e->getMessage());
        }
    }

    public function disconnect(): void
    {
        if ($this->connection && $this->connection->isConnected()) {
            $this->connection->disconnect();
        }
    }
}
